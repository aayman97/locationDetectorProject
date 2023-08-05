import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import BaseText from './src/components/BaseText';
import BaseButton from './src/components/BaseButton';
import {GooglePlacesAutocomplete} from './src/modified libraries/react-native-google-places-autocomplete';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

const {height, width} = Dimensions.get('screen');

function App() {
  const [myCurrentLocation, setMyCurrentLocation] = useState(null);
  const [myFirstLocation, setMyFirstLocation] = useState(null);
  const [viewAddressBox, setViewAddressBox] = useState(true);
  const [longAddress, setLongAddress] = useState('');
  const [shortAddress, setShortAddress] = useState('');
  const locationSearchRef = useRef();
  const [loading, setLoading] = useState(true);

  const detectLoAddressTypes = (arr, type) => {
    let temp = '';
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].types.includes(type)) {
        temp = arr[i].long_name;
        break;
      }
    }

    if (type === 'administrative_area_level_1') {
      return '- ' + temp + ' ';
    } else {
      return temp + ' ';
    }
  };

  const setAdministrativeareaLevel2 = arr => {
    let temp = '';
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].types.includes('administrative_area_level_2')) {
        setShortAddress(arr[i].long_name);
        break;
      }
    }
    return temp;
  };
  useEffect(() => {
    Geocoder.init('AIzaSyB5CSpGmHJxdp1JgZlNYj0jHc4FS91Wv0E');
    Geolocation.getCurrentPosition(info => {
      setMyCurrentLocation({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });

      setMyFirstLocation(info);
    });
  }, []);

  useEffect(() => {
    // console.log('myCurrentLocation : ', myCurrentLocation);
    setLoading(true);
    if (myCurrentLocation) {
      Geocoder.from({
        latitude: myCurrentLocation.latitude,
        longitude: myCurrentLocation.longitude,
      })
        .then(json => {
          //   console.log('myCurrentLocation : ', myCurrentLocation);

          let temp = json.results.filter((val, index) => {
            return val.geometry.location_type === 'RANGE_INTERPOLATED';
          });

          if (temp.length === 0) {
            temp = json.results.filter((val, index) => {
              return val.geometry.location_type === 'ROOFTOP';
            });
          }

          if (temp.length === 0) {
            temp = json.results.filter((val, index) => {
              return val.geometry.location_type === 'APPROXIMATE';
            });
          }

          setLongAddress(
            `${detectLoAddressTypes(
              temp[0].address_components,
              'street_number',
            )}${detectLoAddressTypes(
              temp[0].address_components,
              'route',
            )}${detectLoAddressTypes(
              temp[0].address_components,
              'administrative_area_level_3',
            )}${detectLoAddressTypes(
              temp[0].address_components,
              'administrative_area_level_2',
            )}${detectLoAddressTypes(
              temp[0].address_components,
              'administrative_area_level_1',
            )}`,
          );

          setAdministrativeareaLevel2(temp[0].address_components);
          setViewAddressBox(true);

          if (locationSearchRef.current) {
            locationSearchRef.current.setAddressText(
              `${detectLoAddressTypes(
                temp[0].address_components,
                'street_number',
              )}${detectLoAddressTypes(
                temp[0].address_components,
                'route',
              )}${detectLoAddressTypes(
                temp[0].address_components,
                'administrative_area_level_3',
              )}${detectLoAddressTypes(
                temp[0].address_components,
                'administrative_area_level_2',
              )}${detectLoAddressTypes(
                temp[0].address_components,
                'administrative_area_level_1',
              )}`.trim(),
            );
          }
          setLoading(false);
        })
        .catch(error => console.log(error));
    }
  }, [myCurrentLocation]);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={styles.backgroundContainer}>
        {/* Mapview */}
        {myCurrentLocation && (
          <MapView
            onLayout={e => {
              console.log('mapview layout : ', e.nativeEvent);
            }}
            provider={PROVIDER_GOOGLE}
            style={{
              height: height * 0.93,
              position: 'relative',
            }}
            region={myCurrentLocation}
            onPanDrag={e => {
              setLoading(true);
            }}
            onRegionChangeComplete={e => {
              // setLoading(true);
              setMyCurrentLocation(e);
            }}
            onPress={e => {
              // console.log('press on mapview : ', e.nativeEvent.coordinate);
              setMyCurrentLocation({
                coords: {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                },
              });
            }}></MapView>
        )}
        {/* Marker */}

        <Image
          style={{
            position: 'absolute',
            width: 30,
            height: 30,
            resizeMode: 'contain',
            top: (height * 0.93) / 2 - 25,
            left: width / 2 - 20,
          }}
          source={require('./src/resources/images/marker_icon.png')}
        />

        {/* Get my location button  */}
        <TouchableOpacity
          style={styles.getMyLocationButton}
          onPress={() => {
            Geolocation.getCurrentPosition(info => {
              setMyCurrentLocation({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              });

              setMyFirstLocation(info);
            });
          }}>
          <Image
            source={require('./src/resources/images/get_my_location-button.png')}
            style={{width: 35, height: 35, resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        {/* confirm button */}
        <BaseButton
          style={styles.confirmButton}
          title={'Confirm'}
          loading={loading}
          onPress={() => {
            Alert.alert(longAddress.trim());
          }}
        />

        {/* search header */}
        <View style={styles.headerContainer}>
          {/* Detect your location wrapper */}
          <View style={styles.detectYourLocationConatiner}>
            <TouchableOpacity style={styles.leftArrowButtonContainer}>
              <Image
                source={require('./src/resources/images/arrrow_left_icon.png')}
                style={styles.leftArrow}
              />
            </TouchableOpacity>

            <BaseText size={'f20'}>Detect Your Location</BaseText>

            <View style={styles.leftArrowButtonContainer} />
          </View>

          {/* Search bar wrapper */}

          <View style={styles.detectYourLocationConatiner}>
            <GooglePlacesAutocomplete
              ref={locationSearchRef}
              renderRightButton={() => {
                return (
                  <TouchableOpacity
                    style={{padding: 8, width: '10%'}}
                    onPress={() => {
                      if (viewAddressBox) {
                        setViewAddressBox(false);
                      } else {
                        if (locationSearchRef.current) {
                          locationSearchRef.current.focus();
                        }
                      }
                    }}>
                    {viewAddressBox ? (
                      <Image
                        source={require('./src/resources/images/close_search_icon.png')}
                      />
                    ) : (
                      <Image
                        source={require('./src/resources/images/search_icon.png')}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              styles={{
                textInput: styles.inputContainer,
                textInputContainer: {
                  paddingRight: 10,
                  backgroundColor: '#E6E6E6',
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                },
                row: {
                  padding: 10,
                },
                predefinedPlacesDescription: {
                  backgroundColor: 'red',
                },
              }}
              placeholder="Search"
              query={{key: 'AIzaSyB5CSpGmHJxdp1JgZlNYj0jHc4FS91Wv0E'}}
              fetchDetails={true}
              onPress={(data, details) => {
                setMyCurrentLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                });
              }}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no results')}
            />

            {viewAddressBox && myCurrentLocation && (
              <TouchableOpacity
                style={styles.addressViewBox}
                onPress={() => {
                  setViewAddressBox(false);
                  if (locationSearchRef.current) {
                    locationSearchRef.current.focus();
                  }
                }}>
                <Image
                  source={require('./src/resources/images/location_search_icon.png')}
                  style={{width: '10%', resizeMode: 'contain'}}
                />

                <View style={styles.addressDetailsContainer}>
                  <BaseText color={'#999999'} numberOfLines={1}>
                    {longAddress.trim()}
                  </BaseText>
                  <BaseText>{shortAddress}</BaseText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 15,
    position: 'absolute',
  },
  detectYourLocationConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftArrowButtonContainer: {
    width: 40,
    height: 40,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#E6E6E6',
    color: 'black',
  },
  addressViewBox: {
    width: '87%',
    height: 58,
    backgroundColor: '#E6E6E6',
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
  },
  addressDetailsContainer: {
    width: '91%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  getMyLocationButton: {
    position: 'absolute',
    top: height * 0.78,
    left: width * 0.83,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    position: 'absolute',
    width: width * 0.9,
    height: 46,
    top: height * 0.85,
    borderRadius: 10,
    left: width * 0.05,
  },
});

export default App;
