import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginForm from 'components/ui/screens/login/LoginForm';
import {SECONDARY_COLOR} from 'utils/colors';

/**
 * @Desc: Tarjeta de información, con título e items con viñeta
 * @date 2021-03-12 18:09:33
 */
const OnboardInfoCard = ({
  title = 'Información',
  subtitle = 'Información',
  items = ['Item 1', 'Item 2'],
  onPress,
  customStyle = {},
}) => {
  return (
    <LoginForm style={{...style.additionalContainer, ...customStyle}}>
      <TouchableHighlight
        onPress={onPress}
        underlayColor="#0002"
        style={style.hlContainer}>
        <View style={style.container}>
          <View style={style.columnL}>
            <Text style={style.title}>{title}</Text>
          </View>
          <View style={style.columnR}>
            {items.map((text, i) => (
              <Text style={style.item} key={i}>
                {'\u25CF '}
                {text}
              </Text>
            ))}
          </View>
        </View>
      </TouchableHighlight>
    </LoginForm>
  );
};

const iconSize = 42;
const style = StyleSheet.create({
  additionalContainer: {
    marginVertical: 12,
    paddingBottom: 0,
    backgroundColor: '#2F4474',
  },
  hlContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  columnL: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  columnR: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 23,
    color: '#fff',
    textAlign: 'right',
    paddingRight: 20,
  },
  more: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 23,
    color: '#fff',
    textAlign: 'center',
  },
  item: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#fff',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  arrow: {
    backgroundColor: SECONDARY_COLOR,
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize,
    marginVertical: 8,
    marginRight: 20,
  },
});

export default OnboardInfoCard;
