import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import {leftArrowImg} from '../../images';

class Dates extends PureComponent {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Actions.scoutList();
            }}
            style={styles.imageContainer}>
            <Image source={leftArrowImg} style={styles.imageHeight} />
          </TouchableOpacity>
          <Text style={styles.heading}>DATES</Text>
        </View>

        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {moment(item.date).format('DD/MM/YYYY')}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    height: 50,
    elevation: 6,
    marginBottom: 0,
  },
  heading: {
    color: '#9C27B0',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
  },
  imageContainer: {
    marginLeft: 20,
    position: 'absolute',
    top: 15,
    zIndex: 10,
  },
  imageHeight: {
    height: 20,
    width: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#32485f',
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    borderColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9C27B0',
    alignItems: 'center',
  },
});

export default Dates;
