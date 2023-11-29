export class RefreshTokenUserDataDto {
    id: number;
    email: string;
    isActivated: boolean;

    constructor(model: any) {
        this.email = model.email;
        this.id = model.userId;
        this.isActivated = model.isActivated
    }
}