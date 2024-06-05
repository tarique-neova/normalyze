import { Locator, Page } from '@playwright/test';
import fs from 'fs';
import PropertiesReader from 'properties-reader';

export class LoginPage {

    readonly page: Page;
    readonly loginUsername: Locator;
    readonly loginPassword: Locator;
    readonly submitButton: Locator;
    public commonSecretsObject: JSON;
    public userPassword: string;
    public userName: string;
    public url: string;
    public saasEnv: string;
    public saasBuildId: string;

    constructor(page: Page) {

        this.page = page;
        this.loginUsername = page.locator('[data-test="login-username"]');
        this.loginPassword = page.locator('[data-test="login-password"]');
        this.submitButton = page.locator('[data-test="submit-button"]');

    }

    async performLogin() {

        await this.setSaasEnvironmentTestData();
        await this.page.goto(this.url);
        await this.loginUsername.click();
        await this.loginUsername.fill(this.userName);
        await this.loginPassword.fill(this.userPassword);
        await this.submitButton.click();
        await this.page.waitForURL('**/#/home');

    }

    async setLocalSettingsEventFeedV2M1() {
        await this.page.evaluate(
            "localStorage.setItem('sysdig-storage-internal_feature-eventFeedV2-M1', true)");
    }

    async setLocalSettingsEventFeedV2M21() {
        await this.page.evaluate(
            "localStorage.setItem('sysdig-storage-internal_feature-eventFeedV2-M2.1', true)");
    }

    async setLocalSettingsEventFeedV2M22() {
        await this.page.evaluate(
            "localStorage.setItem('sysdig-storage-internal_feature-eventFeedV2-M2.2', true)");
    }

    async setLocalSettingsEventFeedV2M23() {
        await this.page.evaluate(
            "localStorage.setItem('sysdig-storage-internal_feature-eventFeedV2-M2.3', true)");
    }

    async setLocalSettingsInvestigationInitiative() {
        await this.page.evaluate(
            "localStorage.setItem('sysdig-storage-internal_feature-investigation', true)");
    }

    async setSaasEnvironmentTestData() {

        this.userPassword = 'Ublq%0*as59u98h5b-dz';
        this.saasEnv = "aws-integration-01";
        this.saasBuildId = "uisecure";
        const commonProperties = PropertiesReader("../java-libs/config/secrets/common.properties");
        this.userName = (commonProperties.get('admin.username') as string).replace("%s", this.saasBuildId);
        const saasProperties = PropertiesReader(`../java-libs/config/secrets/${this.saasEnv}.properties`);
        this.url = saasProperties.get("secure.url") as string;

    }
}