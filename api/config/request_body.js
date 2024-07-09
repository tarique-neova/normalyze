export const requestBody = (schedulerName, containerName, dataStoreType, currentTimestamp, currentUser) => {
    return {
      "name": schedulerName,
      "description": "Test Automation Scan Scheduler",
      "dataStoreTags": [containerName, dataStoreType],
      "dataStoreNames": [containerName],
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
      "incrementalScanEnabled": true,
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