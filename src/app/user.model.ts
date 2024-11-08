
export class User {
    constructor (
        public id?: number, 
        public name?: string, 
        public token?: string, 
        public expiration?: number, 
        public expirationDuration?: number
    ) {}

    static fromJSON(jsonString: string | null) : User | null {
        if (!jsonString) {
            return null;
        }
        let data = JSON.parse(jsonString);
        if (!data) {
            return null;
        }
        let user = new User();
        Object.assign(user, data);
        return user;
    }

    getToken() {
        const now = new Date();
        if (this.expiration && now.getTime() < this.expiration) {
            return this.token;
        } else {
            return null;
        }
    }
}