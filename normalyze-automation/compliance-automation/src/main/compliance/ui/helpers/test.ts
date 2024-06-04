import { test as base } from '@playwright/test'
import { EventsFeedPage } from '../pages/eventsfeed.page';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { EventDetailPage } from '../pages/eventdetail.page';

interface CustomFixtures {

    eventsFeedPage: EventsFeedPage;
    loginPage: LoginPage;
    homePage: HomePage;
    eventDetailPage: EventDetailPage

}

export const test = base.extend<CustomFixtures>({

    eventsFeedPage: async ({ page }, use) => {
        await use(new EventsFeedPage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    eventDetailPage: async ({ page }, use) => {
        await use(new EventDetailPage(page));
    }

});

export { expect } from '@playwright/test';
