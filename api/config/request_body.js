/*
@author - Tarique Salat

This is common request body which will be used to create scan scheduler for azure blob container and sql server
*/

export const requestBody = (schedulerName, dataStoreName, dataStoreType, currentTimestamp, currentUser) => {
    return {
      "name": schedulerName,
      "description": "Test Automation Scan Scheduler",
      "dataStoreTags": [dataStoreName, dataStoreType],
      "dataStoreNames": [dataStoreName],
      "dataStoreUsers": [],
      "scanType": "SCAN-SELECTED",
      "dataStoreType": dataStoreType,
      "samplingRate": 100,
      "snippetOption": "FULL",
      "scheduleType": null,
      "scanOnDays": null,
      "enableSnippetForOnprem": false,
      "isCloudTrailBased": false,
      "scanFrequencyInHours": 1,
      "scanAtTime": null,
      "incrementalScanEnabled": false,
      "createdBy": currentUser,
      "cloudAccountScanType": "ALL",
      "cloudAccounts": [],
      "scanToggledAt": currentTimestamp,
      "scanFilterConfig": {
        "extensionPolicy": {
          "extensions": [],
          "mode": "DISABLED"
        },
        "modifiedTimePolicy": {
          "after": 0,
          "before": 0,
          "mode": "DISABLED"
        },
        "prefixPolicy": {
          "mode": "DISABLED",
          "prefixes": []
        },
        "userPolicy": {
          "mode": "DISABLED",
          "users": []
        }
      }
    };
  };