# Schema Information

+ users
---

column      | data type | options
------------|-----------|---------------
id | integer | null: false, primary key
username | string | null: false, index
email | string | null: false, index
password_digest | string  | null: false
full_name | string  | null: false, index
bio | string  |
website_url | string  |
profile_picture | file  |

+ sessions
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
user_id | integer | null: false, foreign key, index
session_token | string  | index

+ follows
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
follower_id | integer | null: false, foreign key, index
user_id | integer | null: false, foreign key, index

+ photos
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
user_id | integer | null: false, foreign key, index
photo | file  | null: false

+ likes
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
user_id | integer | null: false, foreign key, index
photo_id | integer | null: false, foreign key, index

+ comments
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
user_id | integer | null: false, foreign key, index
photo_id | integer | null: false, foreign key, index
body  | text  | null: false

+ phototags
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
user_id | integer | null: false, foreign key, index
photo_id | integer | null: false, foreign key, index
coordinates | point | null: false

+ hashtags
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
comment_id  | integer | null: false, foreign key, index
title | string  | null: false, index

+ mentions
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
comment_id  | integer | null: false, foreign key, index
user_id | integer | null: false, foreign key, index

+ location
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
photo_id | integer | null: false, foreign key, index
name  | string  | null: false, index
coordinates | point |

+ interactions
---

column      | data type | options
------------|-----------|---------------
id  | integer | null: false, primary key
actor_id  | integer | null: false, foreign key, index
action_type | varchar(10) | null: false, index
target_id | integer | null: false, foreign key, index
