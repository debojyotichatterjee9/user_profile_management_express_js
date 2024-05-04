const config = require('config');
const fs = require('fs');
const mongoose = require('mongoose');
const {
    faker
} = require('@faker-js/faker');
const userModel = require("../../modules/user/models");
//  Connect to database
mongoose.connect(config.get('database').mongo_uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
});
const email = 'usermanagement.superadmin@guerrillamail.info';
userModel.User.findOne({
'email': email
}).then(userInfo => {
    if (!userInfo) {
        let userEntry = new userModel.User();
        userEntry.name = {
                name_prefix: "Mr.",
                first_name: "Super",
                last_name: "Admin",
                name_suffix: null
            },
            userEntry.gender = "NEUTRAL",
            userEntry.email = "usermanagement.superadmin@guerrillamail.info",
            userEntry.username = faker.internet.userName(),
            userEntry.authentication = {
                salt_key: faker.git.shortSha(),
                secret_hash: faker.git.commitSha(),
            }
        userEntry.address = [{
                label: "PRIMARY",
                address: faker.address.streetAddress(true),
                city: faker.address.cityName(),
                state: faker.address.state(),
                country: faker.address.country(),
                country_code: faker.address.countryCode("alpha-2"),
                zipcode: faker.address.zipCode(),
                location: {
                    latitude: faker.address.latitude(),
                    longitude: faker.address.longitude()
                },
                timezone: {
                    offset: "0:00",
                    zone: faker.address.timeZone()
                },
                is_default: true
            }, {
                label: "SECONDARY",
                address: faker.address.streetAddress(true),
                city: faker.address.cityName(),
                state: faker.address.state(),
                country: faker.address.country(),
                country_code: faker.address.countryCode("alpha-2"),
                zipcode: faker.address.zipCode(),
                location: {
                    latitude: faker.address.latitude(),
                    longitude: faker.address.longitude()
                },
                timezone: {
                    offset: "0:00",
                    zone: faker.address.timeZone()
                },
                is_default: false
            }],
            userEntry.contact = [{
                label: "PRIMARY",
                country_code: `+${faker.random.numeric(2)}`,
                number: faker.phone.phoneNumber('###-###-###'),
                is_default: true
            }, {
                label: "SECONDARY",
                country_code: `+${faker.random.numeric(2)}`,
                number: faker.phone.phoneNumber('###-###-###'),
                is_default: false
            }],
    userEntry.social_profiles = [{
            label: "Facebook",
            link: faker.internet.url()
        }, {
            label: "Twitter",
            link: faker.internet.url()
        }, {
            label: "Instagram",
            link: faker.internet.url()
        }],
        userEntry.avatar = {
            large: faker.image.people(),
            medium: faker.image.people(),
            small: faker.image.people(),
            thumbnail: faker.image.people()
        },
        userEntry.meta_data = {
            theme_code: faker.internet.color(),
            is_super_admin: true,
            is_enabled: true,
            is_activated: true,
            is_deleted: false
        }
    userEntry.save().then(user => {
        console.log("Super User Added!!!");
        console.log(user);
        process.exit(0);
    }).catch(error => {
        console.log(`ERROR SAVING USER --> ${error}`);
        process.exit(0);
    })
} else {
    console.log("Super User Already exists!!!");
    console.log(userInfo);
    process.exit(0);
}
}).catch(error => {
    console.log(`ERROR FINDING USER --> ${error}`)
});