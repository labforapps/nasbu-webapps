import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AllowedLangs } from "../common";

@Injectable({
    providedIn: 'root'
})
export class LangService {
    private defaultLang = AllowedLangs.English;
    private langItemName: string = 'lang';
    private allowedLangs: string[];

    constructor(private translateService: TranslateService) {
        this.allowedLangs = Object.values(AllowedLangs);
    }

    get currentLang(): AllowedLangs {
        return this.translateService.currentLang as AllowedLangs;
    }

    init(): void {
        this.translateService.addLangs(this.allowedLangs);
        const currentLang = this.getLangItem();
        this.translateService.setDefaultLang(currentLang);
        this.changeLang(currentLang as AllowedLangs);
    }

    changeLang(lang: AllowedLangs): void {
        this.setLangItem(lang);
        this.translateService.use(lang);
    }

    /**
     * return langItem if value is allowed,
     * else if langItem isn't allowed get navigator lang, 
     * finally if navigator lang isn't allowed return default lang  
     * @private
     * @return {*}  {string}
     * @memberof LangService
     */
    private getLangItem(): string {
        const langItem = localStorage.getItem(this.langItemName);
        const validLangItem = this.allowedLangs.find(l => l === langItem);
        if (validLangItem) return validLangItem;

        const browserLang: string = navigator.language.split('-')[0];
        const validBrowserLang = this.allowedLangs.find(l => l === browserLang);
        return validBrowserLang ?? this.defaultLang;
    }

    private setLangItem(lang: string): void {
        localStorage.setItem(this.langItemName, lang);
    }
}