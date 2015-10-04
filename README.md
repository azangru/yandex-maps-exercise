#Description

This is an exercise in using Yandex maps API in an Angular-based app. It follows the requirements listed (in Russian) [in this file](docs/qt-javascript.pdf).

Specifically, [the sample app](http://azangru.github.io/yandex-maps-exercise/) has the following functionality:

- shows an input field for entering addresses (a list of suggestions will appear below the field once the user starts typing);
- when the user selects one of the suggested locations, it is added to the list of locations below the input field;
- a placemark corresponding to this location will appear on the map next to the input field (and the map will move so that the newly added placemark is in its center);
- placemarks on the map are draggable, and clicking on a placemark opens a balloon showing the address of this placemark;
- locations can be deleted from the list by clicking on the red cross to the right of a particular location;
- locations can be sorted by dragging and dropping
- when two or more locations have been added to the list, they will get connected by a polygonal line on the map, starting from the first location in the list;
- adding, removing or sorting locations in the list, as well as dragging placemarks across the map will cause the connecting line to re-draw so that it always properly connects the placemarks on the map.
