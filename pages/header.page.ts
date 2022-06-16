import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HeaderPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public get usernameTxt(): Locator {
        const usernameTxt = this.page.locator("[placeholder='Login']")
        if ( usernameTxt == null) {
            throw new Error('No element found') 
        }
        
        return usernameTxt
    }

    public get passwordTxt(): Locator {
        const passwordTxt = this.page.locator("[name='password']")
        if ( passwordTxt == null) {
            throw new Error('No element found') 
        }
        
        return passwordTxt
    }

    public get loginBtn(): Locator {
        const loginBtn = this.page.locator("text='Login'")
        if (loginBtn == null) {
            throw new Error('No element found') 
        }
        
        return loginBtn
    }
    
    public get registerBtn(): Locator {
        const registerBtn = this.page.locator("text='Register'")
        if (registerBtn == null) {
            throw new Error('No element found') 
        }
        
        return registerBtn
    }

    public get errorMessageTxt(): Locator {
        const errorMessageTxt = this.page.locator("text='Invalid username/password'")
        if (errorMessageTxt == null) {
            throw new Error('No element found')
        }

        return errorMessageTxt
    }

    public get profileBtn(): Locator {
        const profileBtn = this.page.locator("text='Profile'")
        if (profileBtn == null) {
            throw new Error('No element found')
        }

        return profileBtn
    }

    public get logoutBtn(): Locator {
        const logoutBtn = this.page.locator("text='Logout'")
        if (logoutBtn == null) {
            throw new Error('No element found')
        }

        return logoutBtn
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameTxt.fill(username)
        await this.passwordTxt.fill(password)
        await this.loginBtn.click()
    }
}