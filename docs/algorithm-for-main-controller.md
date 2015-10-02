1) When a location is selected in suggestView, add it to the array of locations, with the following format:

```javascript
  {
    name: item.displayName,
    coordinates: [float, float]
  }
```

2) For this location, add a corresponding geoObject to the Yandex map.
Store the geoObject in the geoObject field of the location for reference

3) After adding the geoObject, check whether there are more than one geoObjects on the map. If yes, draw a polyline.
Store the polyline object in the $scope object for further reference.

4) When another location is added, remove the existing polyline and draw another one.

5) Also, re-draw the polyline if:
- a location in the list of locations is dragged;
- a location marker on the map is dragged.
