### Quick To Learn:

* accounting
* convert-units
* querystring
* request

### Medium Used:

* passport - authentication
* socket.io - real time
* lodash - basic helper function. Dont have to read the entire thing

### Important Heavily Used MUST PRACTICE:

* async - each, eachSeries, series, waterfall, setImmediate
* moment - time / date formating
* moment-timezone - timezone
* joi - Validations
* sequelize - database models

### Testing

* chai
* mocha
* throng

---

### Assignment

* Build an shopping site
* 2 types user: admin, and user
* User has time zone: x
* set up socket.io, x
* has to have **product**
* Add the product to the cart
* order table so we can store the table
* Authentication: JWT, and Passport
* Stripe for payment
* Email confirmation: Sendgrid
* Twillio for text message: Place an order then text them an confirmation
* Write test using mocha and chai
* config folder and file, config.js for devleopment and product heroku
* Heroku integration
* Models, Migrations, Seed (sequelize template)
* Mailing and template: ejs x
* User all the cores in

### Table

* `Admin`
* `User`
* `Product`
* Cart
* Order

### Time Zone

```js
const moment = require('moment-timezone');
moment.tz.names();
```

---

## Database Schema

#### `admins`

| column name       | data type |               details |
| ----------------- | :-------: | --------------------: |
| `id`              |  integer  | not null, primary key |
| `username`        |  string   |     indexed, not null |
| `email`           |  string   |     indexed, not null |
| `password_digest` |  string   |              not null |
| `session_token`   |  string   |      not null, unique |
| `created_at`      | date time |              not null |
| `updated_at`      | date time |              not null |

#### `users`

| column name       | data type |               details |
| ----------------- | :-------: | --------------------: |
| `id`              |  integer  | not null, primary key |
| `username`        |  string   |     indexed, not null |
| `email`           |  string   |     indexed, not null |
| `phone`           |  string   |     indexed, not null |
| `password_digest` |  string   |              not null |
| `session_token`   |  string   |      not null, unique |
| `timezone`        |  string   |              not null |
| `cardNumber`      |  string   |              not null |
| `mailingAdress`   |  string   |              not null |
| `shippingAdress`  |  string   |              not null |
| `created_at`      | date time |              not null |
| `updated_at`      | date time |              not null |

* 'user' has many `carts`
* 'user' has many `orders`

#### `products`

| column name   | data type |                   details |
| ------------- | :-------: | ------------------------: |
| `id`          |  integer  |     not null, primary key |
| `name`        |  string   | indexed, not null, unique |
| `description` |  string   |                  not null |
| `quantity`    |  integer  |                  not null |
| `price`       |   float   |                  not null |
| `created_at`  | date time |                  not null |
| `updated_at`  | date time |                  not null |

#### `carts`

| column name  | data type |               details |
| ------------ | :-------: | --------------------: |
| `id`         |  integer  | not null, primary key |
| `items`      |  integer  |              not null |
| `total`      |   float   |              not null |
| `user_id`    |  integer  |              not null |
| `created_at` | date time |              not null |
| `updated_at` | date time |              not null |

* `cart` belongs to `user`
* `cart` has many `products`
* `cart` belongs to `order`

#### `orders`

| column name      | data type |               details |
| ---------------- | :-------: | --------------------: |
| `id`             |  integer  | not null, primary key |
| `address`        |  string   |              not null |
| `timezone`       |  string   |              not null |
| `payment_method` |  string   |              not null |
| `invoice`        |  string   |              not null |
| `cart_id`        |  integer  |              not null |
| `created_at`     | date time |              not null |
| `updated_at`     | date time |              not null |

* `order` belongs to `user`
* `order` has one `cart`
