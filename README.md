# IllusionDatabase
## How to deploy?
```bash=
# 1. Install Yarn
npm install --global yarn

# 2. Install dependencies
yarn install

# 3. Initialize a new database (name: test)
cd ./test_data
node initDB.js
python3 ./importIllusions.py

# 4. Start app
node app.js
```
## Entrypoints
* GET
    * [/illusions?extend=[true|false]](#GET-illusionsextendtruefalse)
    * [/illusions/:id](#GET-illusionsid)
    * [/tags/[elements|effects]?populate=[true|false]](#GET-tagselementseffectspopulatetruefalse)
* POST
    * [/illusions/search/\[elements|effects\]](#POST-illusionssearchelementsffects)
    * [/illusions/:name](#POST-illusionsname)
### GET /illusions?extend=\[true|false\]
#### Request
```
No need to send anything
```
#### Response
```javascript=
// Unextended
[
    {
        "_id": "60310098d77a41032a433b45",
        "title": "McCollough Effect"
    },
    // ...
]
// Extended
[
    {
        "elements": [
            "602d0e92771e4402dd6854d8",
            "602d0e92771e4402dd6854dd",
            "602d0e92771e4402dd6854ea",
            //...
        ],
        "effects": [
            "602d0e92771e4402dd685513",
            "602d0e92771e4402dd685517",
            "602d0e92771e4402dd68551e"
        ],
        "_id": "60310098d77a41032a433b45",
        "update_at": "2021-02-20T12:29:12.020Z",
        "name": "mccollough_effect",
        "content": "## Read this first\nIf you follow the instructions below, you will change your brain for a prolonged time (up to month), in addition to simply remembering this. Proceed only if this is ok with you.",
        "title": "McCollough Effect",
        "__v": 0
    }, 
    // ...
]
```
#### Description
Get all illusions.


---

### GET /illusions/:id
#### Request
```
No need to send anything
```
#### Response
```javascript=
{
    "elements": [
        "602d0e92771e4402dd6854d8",
        "602d0e92771e4402dd6854dd",
        "602d0e92771e4402dd6854ea",
        //...
    ],
    "effects": [
        "602d0e92771e4402dd685513",
        "602d0e92771e4402dd685517",
        "602d0e92771e4402dd68551e"
    ],
    "_id": "60310098d77a41032a433b45",
    "update_at": "2021-02-20T12:29:12.020Z",
    "name": "mccollough_effect",
    "content": "## Read this first\nIf you follow the instructions below, you will change your brain for a prolonged time (up to month), in addition to simply remembering this. Proceed only if this is ok with you.",
    "title": "McCollough Effect",
    "__v": 0
}
```
#### Description
Get a certain illusion by UID

---
### GET /tags/\[elements|effects\]?populate=\[true|false\]
#### Request
```
No need to send anything
```
#### Response
```javascript=
// Unpopulated
[
    {
        "_id": "602d0e92771e4402dd6854d3",
        "name": "規律運動$regular"
    },
    {
        "_id": "602d0e92771e4402dd6854e0",
        "name": "彩度對比"
    }, ...
]
// Populated
[
    {
        "subelements": [
            {
                "subelements": [],
                "_id": "602d0e92771e4402dd6854e6",
                "name": "低飽和"
            },
            {
                "subelements": [],
                "_id": "602d0e92771e4402dd6854e7",
                "name": "亮度相同"
            },
            {
                "subelements": [],
                "_id": "602d0e92771e4402dd6854e8",
                "name": "特定顏色"
            }
        ],
        "_id": "602d0e92771e4402dd6854e5",
        "name": "顏色限制"
    }, ...
]
```
#### Description
Get all tags (elements OR effects).
If you want to retrieve tag hierarchy as well, set `populate=true`.

---

### POST '/illusions/'
#### Request
```
Header:
    Content-Type: application/json
Body:
    {
      "title": "Moire Patterns",
      "elements": [
        "602d0e92771e4402dd6854d2&602d0e92771e4402dd6854d8&602d0e92771e4402dd6854ea&602d0e92771e4402dd6854f3&602d0e92771e4402dd685501",
        "602d0e92771e4402dd6854fe&602d0e92771e4402dd6854db&602d0e92771e4402dd6854f4&602d0e92771e4402dd685505&602d0e92771e4402dd685508"
      ],
      "effects": [
        "602d0e92771e4402dd68551f",
        "602d0e92771e4402dd68552c",
        "602d0e92771e4402dd685534"
      ],
      "gifFileName": "FILE NAME OF GIF",
      "refURL": "URL TO THE REFERENCE",
      "summary": "MARKDOWN CONTENT GOES HERE, BUT YOU NEED TO REPLACE ALL LINEBREAKS WITH /n"
    }
```
#### Response
```
DONE
```
#### Description
Register a new illusion into database. 
**Notice: tag id with the same abstract level should be seperate with an '&'** 

---

### POST /illusions/search/\[elements|effects\]
#### Request
```
Header:
    Content-Type: application/json
Body:
    {
      "tags": [
        "602d0e92771e4402dd685536&602d0e92771e4402dd68551f",
        "602d0e92771e4402dd68553f&602d0e92771e4402dd685520",
        "602d0e92771e4402dd685528&602d0e92771e4402dd685529"
      ]
    }
```
#### Response
```javascript=
[
    "603100add77a41032a433b46"
]
```
#### Description
Find illusions with tags.
**Notice: tag id with the same abstract level should be seperate with an '&'** 