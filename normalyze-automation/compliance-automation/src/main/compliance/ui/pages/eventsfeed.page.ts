import { expect, Locator, Page } from '@playwright/test';

export class EventsFeedPage {

    readonly page: Page;
    readonly enableAutoTuningLink: Locator;
    readonly eventSourceSelector: Locator;
    readonly groupByPolicySelector: Locator;
    readonly selectZonesSelector: Locator;
    readonly selectZonesListBoxItem: Locator;
    readonly severityHighToggleButton: Locator;
    readonly severityMediumToggleButton: Locator;
    readonly severityLowToggleButton: Locator;
    readonly severityInfoToggleButton: Locator;
    readonly unifiedFilterIcon: Locator;
    readonly unifiedFilterInputBox: Locator;
    readonly unifiedFilterListBoxItem: Locator;
    readonly unifiedFilterListBoxItemTotalCount: Locator;
    readonly eventsTableHeader: Locator;
    readonly eventsTableSeverityCell: Locator;
    readonly eventsTableRuleNameCell: Locator;
    readonly clearUnifiedFilterButton: Locator;
    readonly eventsTimeChart: Locator;
    readonly timeNavPauseBtn: Locator;
    readonly timeNavFilterCustomText: Locator;
    readonly eventsFeedCountText: Locator;
    readonly eventsTimechartTimestampLegend: Locator;
    readonly timeNavPresetButtons: Locator;
    readonly eventsTablePolicyGroupCellXpath: string = "//*[@data-test='filter-button-name-value-txt']";
    readonly eventsTableSeverityCellXpath: string = '//*[@data-test="table-severity-cell"]';
    readonly eventsTableRuleNameCellXpath: string = 'xpath=//*[@data-test="filter-button-ruleName-value-txt"]';
    readonly eventsTableRuleNameEqualsOperatorXpath: string = '//*[@data-test="filter-button-ruleName-operator-="]';
    readonly eventsTableRuleNameIdentityOperatorXpath: string = '//*[@data-test="arrow-right-icon"]';
    readonly eventsTableRuleNameContainerXpath: string = '//*[@data-test="table-cell-rule"]';
    readonly severityButtonCommonXpath: string = "//*[contains(@data-test,'event-severity-toggle-')]";
    readonly unifiedFilterContainerXpath: string = "//*[@data-test='uf-pill']//div[@data-value]";
    readonly verticalSidePanelXpath: string = "//*[@data-test='quick-filters-vertical-groups']";
    readonly ruleNameRowXpath: string = '//*[@data-test="filter-button-ruleName-wrapper"]';
    readonly favoriteStarIconXpath: string = "//*[contains(@data-test,'-favorite')]//*[local-name()='svg']";
    readonly recentUnifiedFilterIcon: string = "//*[@data-test='uf-recent-icon']//*[local-name()='svg']";
    readonly recentTabXpath: string = "//*[@data-test='tabs-tab-recent']";
    readonly favoriteTabXpath: string = "//*[@data-test='tabs-tab-favorites']";
    readonly recentTabListXpath: string = "//*[contains(@data-test,'filter-item-recent')]//span";
    readonly favoriteTabListXpath: string = "//*[contains(@data-test,'filter-item-favorite')]//span";
    readonly eventSourceSelectorMenuXpath: string = "//*[@data-test='event-source-selector-menu']";
    readonly unifiedFilterActionsMenuXpath: string = "//*[@data-test='uf-actions-menu']";
    readonly unifiedFilterApplyAsDefaultXpath: string = "//*[@data-test='dropdownmenu-text']";
    readonly eventsTimechartSeverityLegendXpath: string = "//*[@data-test='legend-row-set']";
    readonly eventsTimechartSeverityLegendAttribute: string = 'data-test-row-name';

    constructor(page: Page) {

        this.page = page;
        this.eventSourceSelector = page.locator('[data-test="event-source-selector"]');
        this.groupByPolicySelector = page.locator('[data-test="event-group-selector"]');
        this.selectZonesSelector = page.locator('[data-test="efe-zones-selector"]');
        this.enableAutoTuningLink = page.locator('[data-test="events-page-auto-tuning-btn"]');
        this.selectZonesListBoxItem = page.locator("//*[@data-test='efe-zones-selector-menu']//div[@title]");
        this.severityHighToggleButton = page.locator('[data-test="event-severity-toggle-high"]');
        this.severityMediumToggleButton = page.locator('[data-test="event-severity-toggle-medium"]');
        this.severityLowToggleButton = page.locator('[data-test="event-severity-toggle-low"]');
        this.severityInfoToggleButton = page.locator('[data-test="event-severity-toggle-none"]');
        this.clearUnifiedFilterButton = page.locator('[data-test="uf-clear-filter"]');
        this.unifiedFilterIcon = page.locator('//*[@data-test="uf-recent-icon"]//*[local-name()="svg"]');
        this.unifiedFilterInputBox = page.locator('[data-test="uf-pill"]');
        this.unifiedFilterListBoxItem = page.locator('//*[@data-test="pill-item-operand-option-wrapper"]');
        this.unifiedFilterListBoxItemTotalCount = page.locator('//span[contains(text(), "SUPPORTED FILTERS")]');
        this.eventsTableHeader = page.locator("//*[@data-test='column-header-text']");
        this.eventsTableSeverityCell = page.locator(this.eventsTableSeverityCellXpath);
        this.eventsTableRuleNameCell = page.locator(this.eventsTableRuleNameCellXpath);
        this.eventsTimeChart = page.locator("(//canvas)[2]");
        this.timeNavPauseBtn = page.locator('[data-test="timenav-play-pause"]');
        this.eventsFeedCountText = page.locator("//*[@data-test='event-feed-count']");
        this.eventsTimechartTimestampLegend = page.locator('[data-test="legend-header-timestamp"]');
        this.timeNavFilterCustomText = page.locator('[data-test="timenav-custom"]');
        this.timeNavPresetButtons = page.locator('[data-test="timenav-presets"]');
    }

    async verifySeverityButtons() {

        await expect(this.severityHighToggleButton).toBeVisible();
        await expect(this.severityMediumToggleButton).toBeVisible();
        await expect(this.severityLowToggleButton).toBeVisible();
        await expect(this.severityInfoToggleButton).toBeVisible();

    }

    async pauseEventsTimeNav() {

        await this.timeNavPauseBtn.click();

    }

    async uncheckAllSeverityFilters() {

        let severityButtons = await this.page.locator(this.severityButtonCommonXpath).all();
        for (let i = 0; i < severityButtons.length; i++) {
            const buttonChecked = await severityButtons[i].getAttribute('data-checked');
            if (buttonChecked?.startsWith('true')) {
                await severityButtons[i].click();
            }
        }
    }

    async getAllSeverityFiltersToggleStatus() {

        let severityButtons = await this.page.locator(this.severityButtonCommonXpath).all();
        for (let i = 0; i < severityButtons.length; i++) {
            const buttonChecked = await severityButtons[i].getAttribute('data-checked');
            if (buttonChecked?.startsWith('true')) {
                return ((await severityButtons[i].getAttribute(
                    'data-test') as string).replace("event-severity-toggle-", "").replace("none", 'Info')) as string;
            }
        }
    }

    async verifyUnifiedFilter() {

        await expect(this.unifiedFilterIcon).toBeVisible();
        await expect(this.unifiedFilterInputBox).toContainText("Add Filter");
        await this.unifiedFilterInputBox.click();
        await expect(this.unifiedFilterListBoxItem.first()).toContainText("Select a value or start typing");
        expect(this.unifiedFilterListBoxItem.nth(2)).toBeVisible();
        await expect(this.unifiedFilterListBoxItemTotalCount).toBeVisible();

    }

    async verifyZonesSelector() {

        await expect(this.selectZonesSelector).toBeVisible();
        await expect(this.selectZonesSelector).toContainText("Select Zones");
        await this.selectZonesSelector.click();
        await expect(this.selectZonesListBoxItem.first()).toHaveText(/.{4,}/);
        await expect(this.selectZonesListBoxItem.nth(2)).toBeVisible();
        await this.selectZonesSelector.click();

    }

    async verifyEventsPageTableHeaders() {

        await expect(this.eventsTableHeader).toContainText(["Time", "Severity", "Rule", "Account", "Region",
            "Cluster", "Namespace", "Host", "User", "IP Address"]);
    }

    async waitForEventsFeedTableToLoad() {

        const groupByText = await this.groupByPolicySelector.textContent();
        if (groupByText == "Policy") {
            await this.page.waitForSelector(this.eventsTablePolicyGroupCellXpath);
        } else {
            await this.page.waitForSelector(this.eventsTableSeverityCellXpath);
        }

    }

    async clearUnifiedFilter() {

        await this.clearUnifiedFilterButton.click();
        await this.waitForEventsFeedTableToLoad();

    }

    async getSeverityValuesSetFromTable() {

        await this.page.waitForSelector(this.eventsTableSeverityCellXpath);
        const texts = await this.eventsTableSeverityCell.evaluateAll(list => list.map(element => element.textContent));
        return (new Set(texts));

    }

    async getPolicyGroupNameValuesSetFromTable() {

        await this.page.waitForSelector(this.eventsTablePolicyGroupCellXpath);
        const texts = await this.page.locator(
            this.eventsTablePolicyGroupCellXpath).evaluateAll(list => list.map(element => element.textContent));
        return (new Set(texts));

    }

    async getUnifiedFilterValues() {

        let unifiedFilterText = await this.page.locator(
            this.unifiedFilterContainerXpath).evaluateAll(list => list.map(element => element.getAttribute('data-value')));
        return (unifiedFilterText);

    }

    async getUniqueRuleNameValuesFromTable() {

        await this.page.waitForSelector(this.eventsTableRuleNameCellXpath);
        const texts = await this.eventsTableRuleNameCell.evaluateAll(list => list.map(element => element.textContent));
        return (new Set(texts));

    }

    async applyFirstRuleNameFilterFromTable() {

        let ruleNameTableElement = this.page.locator(this.eventsTableRuleNameContainerXpath).first();
        const ruleNameText = await ruleNameTableElement.locator(this.eventsTableRuleNameCellXpath).textContent();
        await ruleNameTableElement.hover();
        await ruleNameTableElement.locator(this.eventsTableRuleNameEqualsOperatorXpath).click();
        await this.waitForEventsFeedTableToLoad();
        return ruleNameText;
    }

    async clickFirstRuleNameFromTable() {

        let ruleNameTableElement = this.page.locator(this.eventsTableRuleNameContainerXpath).first();
        const eventID = await ruleNameTableElement.locator(
            "xpath=/ancestor::div[contains(@data-test,'table-row-')]").getAttribute('data-test');
        const ruleNameText = await ruleNameTableElement.locator(this.eventsTableRuleNameCellXpath).textContent();
        await ruleNameTableElement.click();
        return { "ruleName": ruleNameText, "eventID": eventID?.replace('table-row-', '') };
    }

    async applyFirstRuleNameFilterFromSidePanel() {

        let ruleNameElement = this.page.locator(this.verticalSidePanelXpath).locator(this.ruleNameRowXpath).first();
        const ruleNameText = await ruleNameElement.locator(this.eventsTableRuleNameCellXpath).textContent();
        await ruleNameElement.hover();
        await ruleNameElement.locator(this.eventsTableRuleNameEqualsOperatorXpath).click();
        await this.waitForEventsFeedTableToLoad();
        return ruleNameText;
    }

    async clickSeverityFilter(severityButtonName: string) {

        if (severityButtonName == 'High') {
            await this.severityHighToggleButton.click();
        }
        await this.waitForEventsFeedTableToLoad();
    }

    async getRecentFilterValues() {

        await this.page.locator(this.recentUnifiedFilterIcon).click();
        await this.page.locator(this.recentTabXpath).click();
        let unifiedFilterText = await this.page.locator(
            this.recentTabListXpath).evaluateAll(list => list.map(element => element.textContent));
        return (unifiedFilterText);

    }

    async getFavoriteFilterValues() {

        await this.page.locator(this.recentUnifiedFilterIcon).click();
        await this.page.locator(this.favoriteTabXpath).click();
        let unifiedFilterText = await this.page.locator(
            this.favoriteTabListXpath).evaluateAll(list => list.map(element => element.textContent));
        return (unifiedFilterText);

    }

    async markFilterAsFavorite() {

        let favoriteStatus = await this.page.locator(this.favoriteStarIconXpath).getAttribute('data-test');
        if (favoriteStatus?.includes('star-empty-favourite-icon')) {
            await this.page.locator(this.favoriteStarIconXpath).click();
            await this.page.waitForTimeout(5000);
        }
    }

    async applyFilterAsDefault() {

        await this.page.locator(this.unifiedFilterActionsMenuXpath).click();
        await this.page.locator(this.unifiedFilterApplyAsDefaultXpath).click();

    }

    async gotoFirstEventIdentityFromTable() {

        let ruleNameTableElement = this.page.locator(this.eventsTableRuleNameContainerXpath).first();
        const ruleNameText = await ruleNameTableElement.locator(this.eventsTableRuleNameCellXpath).textContent();
        await ruleNameTableElement.hover();
        await ruleNameTableElement.locator(this.eventsTableRuleNameIdentityOperatorXpath).click();
        return ruleNameText;

    }

    async clearGroupByPolicy() {

        await this.pauseEventsTimeNav();
        await this.page.locator("//*[@data-test='x-clear-close-small-icon']").click();
        this.waitForEventsFeedTableToLoad();
        const groupByText = await this.groupByPolicySelector.textContent();
        if (groupByText == "Policy") {
            await this.page.locator("//*[@data-test='x-clear-close-small-icon']").click();
        }

    }

    async expandPolicyGroupInEventsTable() {

        await this.page.locator(this.eventsTablePolicyGroupCellXpath).first().click();

    }

    async verifyClickingEnableAutoTuningLink() {

        await this.enableAutoTuningLink.click();
        await this.page.waitForURL('**/#/policies/policy-tuner');

    }

    async applyFilterFromTimechart() {

        const chartCordinates = await this.eventsTimeChart.boundingBox();
        const newStartDeltaX = Math.round((chartCordinates?.width as number) * 0.20);
        const newStartDeltaY = Math.round((chartCordinates?.height as number) * 0.80);
        const newStartX = Math.round(chartCordinates?.x as number + newStartDeltaX);
        const newStartY = Math.round(chartCordinates?.y as number + newStartDeltaY);
        await this.page.mouse.click(newStartX, newStartY);
        const legendSelected = this.page.locator(this.eventsTimechartSeverityLegendXpath).first();
        const legendSelectedText = await legendSelected.getAttribute(this.eventsTimechartSeverityLegendAttribute);
        await legendSelected.click();
        return legendSelectedText;

    }

    async dragToSelectRegionFromTimechart() {

        const chartCordinates = await this.eventsTimeChart.boundingBox();
        const newStartDeltaX = Math.round((chartCordinates?.width as number) * 0.20);
        const newStartDeltaY = Math.round((chartCordinates?.height as number) * 0.80);
        const newStartX = Math.round(chartCordinates?.x as number + newStartDeltaX);
        const newStartY = Math.round(chartCordinates?.y as number + newStartDeltaY);
        const newEndX = Math.round(chartCordinates?.x as number + (newStartDeltaX * 2));
        await this.page.mouse.move(newStartX, newStartY);
        const newStartTime = await this.eventsTimechartTimestampLegend.textContent() as string;
        await this.page.waitForTimeout(1000);
        await this.page.mouse.move(newEndX, newStartY);
        const newEndTime = await this.eventsTimechartTimestampLegend.textContent() as string;
        await this.page.waitForTimeout(1000);
        await this.page.mouse.move(newStartX, newStartY);
        await this.page.mouse.down();
        await this.page.waitForTimeout(1000);
        await this.page.mouse.move(newEndX, newStartY);
        await this.page.waitForTimeout(1000);
        await this.page.mouse.up();
        await this.page.waitForTimeout(1000);
        return { "startTime": newStartTime, "endTime": newEndTime };

    }

    async getEventsFeedCountText() {

        return (await this.eventsFeedCountText.textContent()) as string;

    }

    async gettimeNavFilterCustomText() {

        return (await this.timeNavFilterCustomText.textContent()) as string;

    }

    async applytimeNavPresetFilter(timeFilter: string) {

        await this.timeNavPresetButtons.getByText(timeFilter).click();

    }
}