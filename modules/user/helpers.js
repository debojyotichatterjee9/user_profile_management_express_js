const { User } = require("./models");


exports.PayloadValidation = class PayloadValidation {
    payload;
    messages = [];

    constructor(payload) {
        this.payload = payload;
    }

    async isValidPayload() {

        if (!this.payload.first_name) {
            this.messages.push({
                field: "first_name",
                message: "required field is missing",
            });
        }


        if (!this.payload.last_name) {
            this.messages.push({
                field: "last_name",
                message: "required field is missing",
            });
        }


        if (this.payload.email && this.payload.email.length > 0) {
            if (!this.isValidEmail(this.payload.email)) {
                this.messages.push({
                    field: "email",
                    message: "invalid email address",
                });
            }
            if (await this.isDuplicateEmail(this.payload.email)) {
                this.messages.push({
                    field: "email",
                    message: "existing email address",
                });
            }
        } else {
            this.messages.push({
                field: "email",
                message: "required field is missing",
            });
        }

        if (this.payload.username && this.payload.username.length > 0) {
            if (!this.isValidUsername(this.payload.username)) {
                this.messages.push({
                    field: "username",
                    message: "invalid username",
                });
            }
        } else {
            this.messages.push({
                field: "username",
                message: "required field is missing",
            });
        }

        if (this.payload.password && this.payload.password.length > 0) {
            if (!this.isValidPassword(this.payload.password)) {
                this.messages.push({
                    field: "password",
                    message: "Invalid password",
                });
            }
        } else {
            this.messages.push({
                field: "password",
                message: "required field is missing",
            });
        }

        return {
            messages: this.messages,
            status: this.messages.length > 0 ? false : true,
        };
    }

    isFieldExists(fieldSlug) {
        if ("undefined" == typeof this.payload[fieldSlug]) {
            return false;
        }
        else {
            return true;
        }
    }

    isValidEmail(email) {
        // FORMAT REF: https://tools.ietf.org/html/rfc3696#page-5
        var emailFormat = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if (email.toLocaleLowerCase().match(emailFormat)) {
            return true;
        }
        else {
            return false
        }
    }


    isValidUsername(username = null) {
        /**
         * CONDITIONS FOR A VALID USERNAME:
         * Min Length: 5
         * Max Length: 15
         * All character must be lowercase
         * Allowed symbols : .+_-
         */
        const usernameFormat = /^[[a-zA-Z0-9@.+_-]{5,15}]*$/;
        return usernameFormat.test(username)
    }

    isValidPassword(password = null) {
        /**
         * CONDITIONS FOR A VALID PASSWORD:
         * Min Length: 8
         * Max Length: 50
         * Must contain one Upper Case Letter
         * Must contain one Lower Case Letter
         * Must contain one Numeric Digit
         * Must contain one Special Character
         */
        if (!password) {
            password = this.payload.password;
        }
        const conditions = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,100}$/;
        if (password.match(conditions) && !password.toLowerCase().includes('password')) {
            return true;
        }
        else {
            return false;
        }
    }

    async isDuplicateEmail(email = null, userId = null) {
        email = email ? email.toLocaleLowerCase() : (this.payload.email).toLocaleLowerCase();
        let userInfo = await User.findOne({
            email
        });
        if (userInfo) {
            return userInfo.id === userId ? false : true;
        }
        else {
            return false;
        }
    }

    async isDuplicateUsername(username = null, userId = null) {
        username = username ? username.toLocaleLowerCase() : (this.payload.username).toLocaleLowerCase();
        let userInfo = await User.findOne({
            username
        });
        if (userInfo) {
            return userInfo.id === userId ? false : true;
        }
    }
};


exports.saveUser = (payload) => {
    let userInfo = new User();
    userInfo.first_name = payload.first_name;
    userInfo.last_name = payload.last_name;
    userInfo.email = payload.email;
    userInfo.username = payload.username;
    userInfo.save();
    return userInfo;
}