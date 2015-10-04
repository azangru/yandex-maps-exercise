var geocoderResponse = {
  "GeoObjectCollection": {
    "metaDataProperty": {
      "GeocoderResponseMetaData": {
        "request": "Москва, улица Новый Арбат, дом 24",
        "found": "1",
        "results": "10"
      }
    },
    "featureMember": [
      {
        "GeoObject": {
          "metaDataProperty": {
            "GeocoderMetaData": {
              "kind": "house",
              "text": "Россия, Москва, улица Новый Арбат, 24",
              "precision": "exact",
              "AddressDetails": {
                "Country": {
                  "AddressLine": "Москва, улица Новый Арбат, 24",
                  "CountryNameCode": "RU",
                  "CountryName": "Россия",
                  "AdministrativeArea":{
                    "AdministrativeAreaName": "Московская область",
                    "SubAdministrativeArea": {
                      "SubAdministrativeAreaName": "Москва",
                      "Locality": {
                        "LocalityName": "Москва",
                        "Thoroughfare": {
                          "ThoroughfareName": "улица Новый Арбат",
                          "Premise": {
                            "PremiseNumber": "24"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "description": "Москва, Россия",
          "name": "новый арбат, 24",
          "boundedBy": {
            "Envelope": {
              "lowerCorner": "37.583490 55.750778",
              "upperCorner": "37.591701 55.755409"
            }
          },
          "Point": {
            "pos": "37.587596 55.753093"
          }
        }
      }
    ]
  }
}
