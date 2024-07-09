import axios from 'axios';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { requestBody } from '../config/request_body.js';

const NORMALYZE_BASE_URL = 'https://api3.normalyze.link';
const JWT_SECRET= "yourSigningSecret"
const jwt = jsonwebtoken;


await dotenv.config({ path: './.env' });
const NORMALYZE_ACCOUNT_USERNAME = process.env.NORMALYZE_ACCOUNT_USERNAME;
const NORMALYZE_ACCOUNT_PASSWORD = process.env.NORMALYZE_ACCOUNT_PASSWORD;


export async function getJsonFile(filePath) {
  try {
    const rawData = await fs.promises.readFile(filePath, 'utf-8');
    const config = JSON.parse(rawData);
    return config;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function doLogin(email, password, session, configService) {
  const url = `${configService}/api/login`;
  const data = { email, password };
  const headers = { 'Authorization': session.authToken };
  const res = await axios.post(url, data, { headers });
  const apiData = res.data;
  session.jobId = apiData.id;
 
  if (!session.teamId) {
    session.teamId = await res.data.data.team.id;
  }
 
  if (process.env.serviceEnv === "govServices") {
    session.authToken = "Bearer " + res.headers["x-auth-token"];
  }
}
 
export async function generateJwtInitialToken(userLogin, session, nzRole = "Admin") {
  userLogin = {
    "https://normalyze/version": 3,
    "https://normalyze/permissions": {
      teams: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      accounts: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      datastores: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      assets: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      identities: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      packages: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      risks: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      risksignatures: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      integrations: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      automations: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      apikeys: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      entities: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      profiles: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      scansettings: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      querybuilder: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"],
      visualization: ["list", "get", "create", "destroy", "destroyAll", "update", "replace"]
    },
    "https://normalyze/limits": {
      scanprofiles: 100,
      cloudScanfrequency: {
        FULL: {
          durationSecs: 86400,
          limit: 4
        },
        INCREMENTAL: {
          intervalSecs: 900
        }
      },
      apiratelimits: 1000
    },
    "https://normalyze/role": nzRole,
    ...userLogin
  };
 
  const token = jwt.sign(userLogin, JWT_SECRET);
  session.authToken = "Bearer " + token;
}
 
 
export async function doLoginWithTeamId() {
  const DP_AUTO_USER_EMAIL_ID = NORMALYZE_ACCOUNT_USERNAME;
  const uiLoginPassword = NORMALYZE_ACCOUNT_PASSWORD;
  const userLogin = { email: DP_AUTO_USER_EMAIL_ID, password: uiLoginPassword };
  const configService = "https://api3.normalyze.link/config";
  const session = {};  
  await generateJwtInitialToken(userLogin, session);
  // console.log(session.authToken, "session auth");
  await doLogin(DP_AUTO_USER_EMAIL_ID, uiLoginPassword, session, configService);  
  const userLoginTeamId = {
    "https://normalyze/email": DP_AUTO_USER_EMAIL_ID,
    "https://normalyze/team": session.teamId,
    "https://normalyze/issuperuser": false
  };  
  await generateJwtInitialToken(userLoginTeamId, session);
  await doLogin(DP_AUTO_USER_EMAIL_ID, uiLoginPassword, session, configService);  
  return session.authToken;
}

export async function createScheduler(dataStoreType, containerName, schedulerName, currentTimestamp, currentUser) {
  const token = await doLoginWithTeamId();
  const url = `${NORMALYZE_BASE_URL}/status/api/scanprofiles`;
  console.log(`url - ${url}`)
  const data = requestBody(schedulerName, containerName, dataStoreType, currentTimestamp, currentUser);
  const headers = {
    'Authorization': token,
  };
  const response = await axios.post(url, data, { headers });
  return response.data.id;
}


export async function getAllSchedulers() {
  const token = await doLoginWithTeamId();
  const response = await axios.get(`${NORMALYZE_BASE_URL}/status/api/scanprofiles`, {
    headers: {
      'Authorization': token,
    }
  });
  return response.data.data;
}

export async function runScheduler(schedulerId) {
  const token = await doLoginWithTeamId();
  const baseUrl = `${NORMALYZE_BASE_URL}/status/api/v2/scanprofiles/`;
  const url = baseUrl + schedulerId + '/run';
  const data = {};
  const headers = {
    'Authorization': token,
    'Origin': 'https://webui.normalyze.link',
  };
  const response = await axios.post(url,data, { headers });
  return response.data;
}

export async function getSnippets(dataStoreType, dataSoreName, dataStoreId, region) {
  const token = await doLoginWithTeamId();
  const url = `${NORMALYZE_BASE_URL}/status/api/v2/snippets?accountId=f22fa846922f&dataStoreType=${dataStoreType}&dataStoreId=${encodeURIComponent(dataStoreId)}&region=${region}&dataStoreName=${encodeURIComponent(dataSoreName)}`;
  const response = await axios.get(url, {
    headers: {
      'Authorization': token,
    }
  });
  return [response.data.data];
}