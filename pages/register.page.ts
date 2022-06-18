import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    public get registerPageLbl(): Locator {
        const registerPageLbl = this.page.locator("text='Register with Buggy Cars Rating'")

        if (registerPageLbl == null) {
            throw new Error('No element found')
        }

        return registerPageLbl
    }

    public get registerBtn(): Locator {
        const registerBtn = this.page.locator("button:has-text('Register')")

        if (registerBtn == null) {
            throw new Error('No element found')
        }

        return registerBtn
    }

    public get cancelBtn(): Locator {
        const cancelBtn = this.page.locator("a:has-text('Cancel')")

        if (cancelBtn == null) {
            throw new Error('No element found')
        }

        return cancelBtn
    }

    public get registerSuccessLbl(): Locator {
        const registerSuccessLbl = this.page.locator("text='Registration is successful'")

        if (registerSuccessLbl == null) {
            throw new Error('No element found')
        }

        return registerSuccessLbl
    }

    public get registerFailureLbl(): Locator {
        const registerFailureLbl = this.page.locator("text='UsernameExistsException: User already exists'")

        if (registerFailureLbl == null) {
            throw new Error('No element found')
        }

        return registerFailureLbl
    }

    async fillRegistrationDetails(registrationDetails: Partial<{
        username: string,
        firstName: string,
        lastName: string,
        password: string,
        confirmPassword: string,
    }>): Promise<void> {
        await this.page.locator("[id='username']").fill(registrationDetails.username ?? '')
        await this.page.locator("[id='firstName']").fill(registrationDetails.firstName ?? '')
        await this.page.locator("[id='lastName']").fill(registrationDetails.lastName ?? '')
        await this.page.locator("[id='password']").fill(registrationDetails.password ?? '')
        await this.page.locator("[id='confirmPassword']").fill(registrationDetails.confirmPassword ?? '')
    }
}