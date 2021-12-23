# <p>Backend For Potluck-Planner-3</P>


## <p>https://potluck-planner-3-ft.herokuapp.com/</p>

## REGISTER / LOGIN

### [POST] /api/auth/register

- User register
  - _username required (must be unique)_
  - _password required_

_Send_
```json
{
  "username": "user",
  "password": "password"
}
```
_Response_
```json
{
  "message": "Successfully registered user"
}
```

### [POST] /api/auth/login

- User login
  - _username required_
  - _password required_

_Send_
```json
{
  "username": "user",
  "password": "password"
}
```

_Response_
```json
{
  "message": "Welcome back user!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva",
  "user_id": 1
}
```
## USERS _(RESTRICTED)_

### [GET] /api/users

- Return array of users
  - _requires token in header_

_Response_
```json
[
  {
    "user_id": 1,
    "username": "user"
  },
  {
    "user_id": 2,
    "username": "user2"
  }
]
```
### [GET] /api/users/:user_id

- Return user with specified user_id
  - _requires token in header_

_Response_
```json
{
  "user_id": 1,
  "username": "user"
}
```

### [POST] /api/users
- Returns a user's user_id inside of an object
  - Requires an existing user's _username_

_Send_
```json
{
  "username": "user",
}
```

_Response_
```json
{
  "user_id": 1,
}
```

### [POST] /api/users/:user_id/potlucks
- Creates new potluck object by individual users
  - _potluck_name required_
  - _date required_
  - _time required_
  - _location required_

_Send_
```json
{
 "potluck_name": "potluck 1",
 "date": "2021/12/21",
 "time": "12:00",
 "location": "nowhere"
}
```
_Response_
```json
{
 "potluck_name": "potluck 1",
 "date": "2021/12/21",
 "time": "12:00",
 "location": "nowhere",
 "user_id": 1,
 "guests": [
  {
    "user_id": 1,
    "username": "user",
    "attending": true,
  }
 ]
}
```

## POTLUCKS _(RESTRICTED)_

### [GET] /api/potlucks
- Returns array of potlucks in database

_Response_
```json
[
  {
    "potluck_id": 1,
    "potluck_name": "potluck 1",
    "date": "2021/12/21",,
    "time": "11:00",
    "location": "america",
    "user_id": 1
  }
]
```
### [GET] /api/potlucks/:potluck_id
- Returns array of potlucks by potluck ID

```json
[
  {
    "potluck_id": 1,
    "potluck_name": "potluck 1",
    "date": "2021/12/21",,
    "time": "11:00",
    "location": "america",
    "user_id": 1
    "guests": [
      {
        "user_id": 1,
        "username": "user",
        "attending": true
      }
    ]
    "foods": [
      {
        "food_name": "pizza",
        "user_id": 1,
        "username": "user"
      }
    ]
  }
]
```
### [GET] /api/potlucks/:potluck_id/guests
- Returns array of guests by potluck ID

```json
[
 {
  "user_id": 1,
  "username": "user1",
  "attending": true
 },
 {
  "user_id": 3,
  "username": "user3",
  "attending": false
 }
]
```
### [GET] /api/potlucks/:potluck_id/foods

- Returns an array of food by potluck ID

```json
[
 {
  "food_name": "pizza",
  "user_id": 1,
  "username": "user"
 }
]
```

### [POST] /api/potlucks/:potluck_id/guests

- Add an array of guests by potluck ID
  - _user_id required_
  - _attending required_

_Send_
```json
[
  {
   "user_id": 1,
   "attending": true
  },
  {
   "user_id": 2,
   "attending": false
  }
]
```

_Response_
```json
{
 "user_id": 1,
 "username": "user",
 "attending": true
}
```

### [POST] /api/potlucks/:potluck_id/foods
- Adds a food to a potluck
  - _food_name required (must be unique)_

_Send_
```json
{
  "food_name": "pizza",
}
```

_Response_
```json
[
 {
  "food_name": "pizza",
  "user_id": 1,
  "username": "user"
 }
]
```

### [PUT] /api/potlucks/:potluck_id

- Update Potluck by ID
  - _potluck_name required_
  - _date required_
  - _time required_
  - _location required_

 _Send_
 ```json
 {
   "potluck_name": "updated potluck",
   "date": "2021/12/21",
   "time": "12:00",
   "location": "nowhere"
 }
 ```

 _Response_
 ```json
 {
   "potluck_id": 1,
   "potluck_name": "updated potluck",
   "time": "12:00",
   "location": "nowhere",
   "user_id": 1
 }
 ```

 ### [PUT] /api/potlucks/:potluck_id/guests/:user_id

- Update Guest attendance
  - _attending status required (boolean)_

 _Send_
 ```json
 {
   "attending": "false",
 }
 ```

 _Response_
 ```json
 {
   "user_id": 1,
   "username": "user",
   "attending": "false"
 }
 ```

 ### [DELETE] /api/potlucks/:potluck_id

 - Delete Potluck by ID

### [DELETE] /api/potlucks/:potluck_id/guests

- Delete Guest By Potluck ID
  - _user_id required_

_Send_

```json
{
  "user_id": 1
}
```

- Responds with all guests from specified potluck ID

### [DELETE] /api/potlucks/:potluck_id/foods

- Delete food_name from Potluck ID
  - _food_name required_


_Send_
```json
{
  "food_name": "food item"
}
```

- Responds back with all food item from potluck ID
