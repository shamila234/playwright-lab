import { test, expect, Page } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'
import { HeaderPage } from '../pages/header.page';
import { RegisterPage } from '../pages/register.page';

let page: Page

test.beforeEach(async ({ context }) => {
    page = await context.newPage()
    await page.goto('https://buggy.justtestit.org', {
        waitUntil: 'load'
    })
    await expect(page).toHaveTitle('Buggy Cars Rating');
    await expect(page.locator("a >> text='Buggy Rating'")).toBeVisible()
})

test.afterEach(async ({ context }) => {
    await context.close()
})

test.describe('Buggy Car Rating - E2E Tests', () => {
    test.describe('Login validation', () => {
        let header: HeaderPage

        test.beforeEach(() => {
             header = new HeaderPage(page)
        })

        test('should able to login with valid credentials', async () => {
            await header.login('testuser.234', 'Abcd.123')
            await expect(header.profileBtn).toBeVisible()
            await expect(header.logoutBtn).toBeVisible()
        })
    
        test('should not be able to login with invalid credentials', async () => {
            await header.login('invalid', 'invalid')
            await expect(header.errorMessageTxt).toBeVisible()
            await expect(header.profileBtn).not.toBeVisible()
            await expect(header.logoutBtn).not.toBeVisible()
        })
    })

    test.describe('Register page validations', () => {
        let header: HeaderPage
        let registerPage: RegisterPage

        test.beforeEach(() => {
             header = new HeaderPage(page)
             registerPage = new RegisterPage(page)
        })

        const registrationDetails = {
            username: uuidv4(),
            firstName: 'Aamir',
            lastName: 'Khan',
            password: 'Abcd.123'
        }

        test('should be able to successfully register a new user', async () => {
            await header.registerBtn.click()
            await expect(registerPage.registerPageLbl).toBeVisible()
            expect(page.url()).toEqual('https://buggy.justtestit.org/register')
            
            page.route('**/users', route => {
                route.fulfill({
                    body: JSON.stringify({}),
                    status: 201,
                })
            })
            page.on('request', request => {
                expect(request.postDataBuffer()?.toString('utf8')).toEqual(JSON.stringify({
                    ...registrationDetails,
                    confirmPassword: registrationDetails.password
                }))
            })

            await registerPage.fillRegistrationDetails({
                ...registrationDetails,
                confirmPassword: registrationDetails.password
            })
            await expect(registerPage.registerBtn).toBeEnabled()
            await registerPage.registerBtn.click()
            
            await expect(registerPage.registerSuccessLbl).toBeVisible()
        })

        test('should cancel return back to home page', async () => {
            await header.registerBtn.click()
            await expect(registerPage.registerPageLbl).toBeVisible()
            expect(page.url()).toEqual('https://buggy.justtestit.org/register')

            await registerPage.cancelBtn.click()
            
            await expect(page.locator("text=Buggy Rating Login Register BuggyCarsRating >> img")).toBeVisible()
            expect(page.url()).toEqual('https://buggy.justtestit.org/')
        })

        test('Register button should be disabled by default on page load', async () => {
            await header.registerBtn.click()
            await expect(page.locator("text='Register with Buggy Cars Rating'")).toBeVisible()
            expect(page.url()).toEqual('https://buggy.justtestit.org/register')

            await expect(registerPage.registerBtn).toBeDisabled()
        })

        test('should not allow new user to register with an existing username', async () => {
            await header.registerBtn.click()
            await expect(page.locator("text='Register with Buggy Cars Rating'")).toBeVisible()
            expect(page.url()).toEqual('https://buggy.justtestit.org/register')

            await registerPage.fillRegistrationDetails({
                ...registrationDetails,
                username: 'testuser.234',
                confirmPassword: registrationDetails.password
            })
            await expect(registerPage.registerBtn).toBeEnabled()
            await registerPage.registerBtn.click()

            await expect(registerPage.registerFailureLbl).toBeVisible()
        })
    })

    test.describe('Car voting validations', () => {
        test('should be able to vote for a selected model', async () => {
            page.route('**/token', route => {
                route.fulfill({
                    body: JSON.stringify({
                        access_token: uuidv4(),
                        expires_in: 3600,
                        refresh_token: uuidv4(),
                        token_type: "Bearer"
                    }),
                    contentType: 'application/json',
                    status: 200
                })
            })
            page.route('**/current', route => {
                route.fulfill({
                    body: JSON.stringify({
                        firstName: "first",
                        isAdmin: false,
                        lastName: "last"
                    }),
                    contentType: 'application/json',
                    status: 200
                })
            })
            page.route('**/models/*', route => {
                route.fulfill({
                    body: JSON.stringify({
                        canVote: true,
                        comments: [],
                        description: "The style of the *Mito* lives up to the latest news from the Alfa Romeo family in design, onboard experience and in its performance too.\n\nIn this way, the smallest Alfa Romeo sporty car hasn’t just grown-up: it has become grandiose.\n\nStrength and agility are Mito’s strong points. To provide them, Alfa Romeo engineers worked hard on every element of the car, to ensure only the best performance.",
                        engineVol: 1.4,
                        image: "mito.jpg",
                        make: "Alfa Romeo",
                        makeId: "c4u1mqnarscc72is00ng",
                        makeImage: "AR-logo.jpg",
                        maxSpeed: 219,
                        name: "Mito",
                        votes: 1549,
                    }),
                    contentType: 'application/json',
                    status: 200
                })
            })
            page.route('**/vote', route => {
                route.fulfill({
                    status: 200
                })
            })
            await page.locator("[placeholder='Login']").fill('test')
            await page.locator("[name='password']").fill('test')
            await page.locator("text='Login'").click()
            await page.locator("text=Overall Rating List of all registered models. >> img").click()
            await page.locator("text=Mito").click()
            await expect(page.locator("[id='comment']")).toBeVisible()
            await expect(page.locator("button:has-text('Vote!')")).toBeEnabled()
            page.unroute('**/models/*')
            await page.locator("button:has-text('Vote!')").click()
            await expect(page.locator("text=Thank you for your vote!")).toBeVisible()
            await expect(page.locator("button:has-text('Vote!')")).toBeHidden()
        })
    })
})