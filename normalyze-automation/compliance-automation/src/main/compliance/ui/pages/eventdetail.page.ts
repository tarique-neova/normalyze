import { expect, Locator, Page } from '@playwright/test';

export class EventDetailPage {

    readonly page: Page;
    readonly eventSourceSelector: Locator;
    readonly eventDetailTitle: Locator;
    readonly eventDetailID: Locator;
    readonly eventDetailPanel: string = "//*[contains(@data-test,'selected-event-')]";

    constructor(page: Page) {
        this.page = page;
        this.eventDetailTitle = page.locator('[data-test="event-detail-title"]');
        this.eventDetailID = page.locator('[data-test="event-detail-overline"]');
    }

    async getEventDetailData() {

        const eventDetailIDValue = await this.eventDetailID.textContent();
        const eventDetailRuleValue = await this.eventDetailTitle.textContent();
        return ({ "eventID": eventDetailIDValue, "ruleName": eventDetailRuleValue });

    }
}