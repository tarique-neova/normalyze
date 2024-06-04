import { test, expect } from '../helpers/test';
import { EventsFeedPage } from '../pages/eventsfeed.page';
import { EventDetailPage } from '../pages/eventdetail.page';

test.beforeEach(async ({ loginPage, page }) => {

  await loginPage.performLogin();
  await loginPage.setLocalSettingsEventFeedV2M1();
  await loginPage.setLocalSettingsEventFeedV2M21();
  await loginPage.setLocalSettingsInvestigationInitiative();

})

test('TESTS-11894 - Validate Expected UI Components On Events Feed UI', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.verifySeverityButtons();
  await eventsFeedPage.verifyUnifiedFilter();
  await eventsFeedPage.verifyEventsPageTableHeaders();
  await eventsFeedPage.verifyZonesSelector();
  await eventsFeedPage.verifyClickingEnableAutoTuningLink();

});

test('TESTS-11906 - Apply a Severity Toggle Filters & Validate Table Contents Are Filtered', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  await eventsFeedPage.uncheckAllSeverityFilters();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  await eventsFeedPage.clickSeverityFilter('High');
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedFilter = await eventsFeedPage.getSeverityValuesSetFromTable();
  expect(appliedFilter).toContainEqual('High');

});

test('TESTS-11907 - Apply a Severity Filter From Timechart & Validate the Filtered page', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  await eventsFeedPage.uncheckAllSeverityFilters();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedFilterSeverityTextValue = await eventsFeedPage.applyFilterFromTimechart();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedFilter = await eventsFeedPage.getSeverityValuesSetFromTable();
  expect(appliedFilter).toContainEqual(appliedFilterSeverityTextValue);
  expect(await eventsFeedPage.getAllSeverityFiltersToggleStatus()).toContain(appliedFilterSeverityTextValue?.toLowerCase());

});

test('TESTS-11908 - Apply a Rule Name Filter From Table & Validate On The Page', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedRuleFilter = await eventsFeedPage.applyFirstRuleNameFilterFromTable();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(await eventsFeedPage.getUniqueRuleNameValuesFromTable()).toContainEqual(appliedRuleFilter);
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilter);
  await eventsFeedPage.clearUnifiedFilter();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(((await eventsFeedPage.getUnifiedFilterValues()).includes(appliedRuleFilter))).toBeFalsy();

});

test('TESTS-11909 - Validate MITRE Quick Filters, Defaults & Favorite On The Page', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedRuleFilter = await eventsFeedPage.applyFirstRuleNameFilterFromSidePanel();
  expect(await eventsFeedPage.getUniqueRuleNameValuesFromTable()).toContainEqual(appliedRuleFilter);
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilter);
  await page.waitForTimeout(5000);
  expect(await eventsFeedPage.getRecentFilterValues()).toContain(appliedRuleFilter);
  await eventsFeedPage.markFilterAsFavorite();
  expect(await eventsFeedPage.getFavoriteFilterValues()).toContain(appliedRuleFilter);

});

test('TESTS-11910 - Verify Default Behaviour of the Filters', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedRuleFilter = await eventsFeedPage.applyFirstRuleNameFilterFromSidePanel();
  expect(await eventsFeedPage.getUniqueRuleNameValuesFromTable()).toContainEqual(appliedRuleFilter);
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilter);
  await eventsFeedPage.applyFilterAsDefault();
  await page.waitForTimeout(5000);
  await eventsFeedPage.clearUnifiedFilter();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(((await eventsFeedPage.getUnifiedFilterValues()).includes(appliedRuleFilter))).toBeFalsy();
  await page.reload();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilter);

});

test('TESTS-11911 - Timechart Drag to Zoom Feature Test', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.applytimeNavPresetFilter("2 w");
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const beforeZoomText = await eventsFeedPage.getEventsFeedCountText();
  const filteredTime = await eventsFeedPage.dragToSelectRegionFromTimechart();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const afterZoomText = await eventsFeedPage.getEventsFeedCountText();
  expect(beforeZoomText.includes(afterZoomText)).toBeFalsy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const timeNavText = (await eventsFeedPage.gettimeNavFilterCustomText()).toLowerCase();
  expect(timeNavText.startsWith(filteredTime.startTime.toLowerCase())).toBeTruthy();
  expect(timeNavText.includes(filteredTime.endTime.toLowerCase())).toBeTruthy();

});

test('TESTS-11916 - Click an Event To Verify Event Details Panel Data', async ({ homePage, eventDetailPage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.clearGroupByPolicy();
  await eventsFeedPage.applytimeNavPresetFilter("2 w");
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const eventsFeedRow = await eventsFeedPage.clickFirstRuleNameFromTable();
  const eventDetails = await eventDetailPage.getEventDetailData();
  expect(eventDetails.ruleName).toContain(eventsFeedRow.ruleName);
  expect(eventDetails.eventID).toContain(eventsFeedRow.eventID);

});

test('TESTS-11918 - Verify Persistence of User Actions In Old & New Tabs', async ({ context, homePage, page }) => {

  await homePage.gotoEventsFeedPage();
  const eventsFeedOldPage = new EventsFeedPage(page);
  const appliedRuleFilterOld = await eventsFeedOldPage.applyFirstRuleNameFilterFromSidePanel();
  await eventsFeedOldPage.waitForEventsFeedTableToLoad();
  const pageOne = await context.newPage();
  pageOne.goto(page.url());
  const eventsFeedPage = new EventsFeedPage(pageOne);
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilterOld);
  await eventsFeedPage.clearUnifiedFilter();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  await eventsFeedPage.expandPolicyGroupInEventsTable();
  const appliedRuleFilter = await eventsFeedPage.applyFirstRuleNameFilterFromTable();
  expect(await eventsFeedPage.getUniqueRuleNameValuesFromTable()).toContainEqual(appliedRuleFilter);
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedRuleFilter);
  await eventsFeedPage.clearUnifiedFilter();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(((await eventsFeedPage.getUnifiedFilterValues()).includes(appliedRuleFilter))).toBeFalsy();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const eventsFeedRow = await eventsFeedPage.clickFirstRuleNameFromTable();
  const eventDetailPage = new EventDetailPage(pageOne);
  const eventDetails = await eventDetailPage.getEventDetailData();
  expect(eventDetails.ruleName).toContain(eventsFeedRow.ruleName);
  expect(eventDetails.eventID).toContain(eventsFeedRow.eventID);

});

test('TESTS-11939 - Apply a Policy Name Filter From Timechart & Validate the Filtered Page', async ({ homePage, eventsFeedPage, page }) => {

  await homePage.gotoEventsFeedPage();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const appliedFilterPolicyTextValue = await eventsFeedPage.applyFilterFromTimechart();
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  expect(await eventsFeedPage.getUnifiedFilterValues()).toContain(appliedFilterPolicyTextValue);
  await eventsFeedPage.waitForEventsFeedTableToLoad();
  const policyFilterTableValues = await eventsFeedPage.getPolicyGroupNameValuesSetFromTable();
  expect(policyFilterTableValues).toContainEqual(appliedFilterPolicyTextValue);

});
