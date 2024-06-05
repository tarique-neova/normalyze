import { expect, Locator, Page } from '@playwright/test';

export class HomePage {

    readonly page: Page;
    readonly eventsNavigationLink: Locator;
    readonly homeNavigationLink: Locator;
    readonly eventsFeedSubNavigationLink: Locator;
    readonly eventsPageHeaderText: string = "//*[@data-test='header']//*[text()='Events']";

    constructor(page: Page) {

        this.page = page;
        this.eventsNavigationLink = page.locator('[data-test="app-nav-item-events"]');
        this.homeNavigationLink = page.locator('[data-test="app-nav-item-home"]');
        this.eventsFeedSubNavigationLink = page.locator(
            '//*[@data-test="app-nav-submenu-events"]//*[text()="Events Feed"]');
    }

    async gotoEventsFeedPage() {

        await this.eventsNavigationLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForURL('**/#/events');
        await expect(this.page).toHaveURL(/.*events/);
        await this.page.locator(this.eventsPageHeaderText).click();

    }

    async gotoHomePage() {

        await this.homeNavigationLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}