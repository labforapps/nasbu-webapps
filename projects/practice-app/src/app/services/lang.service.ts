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

    get currentLang(): string {
        return this.translateService.currentLang
    }

    init(): void {
        this.translateService.addLangs(this.allowedLangs);
        const currentLang = this.getLangItem();
        this.translateService.setDefaultLang(currentLang);
        this.translateService.use(currentLang);
    }

    changeLang(lang: AllowedLangs): void {
        this.setLangItem(lang);
        this.translateService.use(lang);
    }

    private getLangItem(): string {
        const lang = localStorage.getItem(this.langItemName);
        const validLang = this.allowedLangs.find(l => l === lang);
        return validLang ?? this.defaultLang;
    }

    private setLangItem(lang: AllowedLangs): void {
       localStorage.setItem(this.langItemName, lang);
    }
}