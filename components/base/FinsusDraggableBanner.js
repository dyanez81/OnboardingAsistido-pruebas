import React, {Component, Children} from 'react';
import {
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PRIMARY_COLOR, SECONDARY_COLOR} from 'utils/colors';

const getDirection = ({moveX, moveY, dx, dy}) => {
  const draggedDown = dy > 30;
  const draggedUp = dy < -30;
  const draggedLeft = dx < -30;
  const draggedRight = dx > 30;

  const _direction = draggedDown
    ? 'down'
    : draggedUp
    ? 'up'
    : draggedLeft
    ? 'left'
    : draggedRight
    ? 'right'
    : 'none';

  return _direction;
};

/**
 * javascript comment
 * @Author: AZozaya
 * @Date: 2020-05-21 16:49:24
 * @Desc: Un banner que aparece gradualmente desde abajo
 * @property {bool} visible Indica si se mostrará o no (false)
 * @property {bool} collapsedHeight Altura del banner minimizado (200)
 * @property {bool} expandedMargin Margen superior al expandir (150)
 * @property {bool} duration Tiempo en ms que se mostrará el banner (5000)
 * @property {bool} onExpand Función que se ejecuta al expandir ({})
 * @property {bool} onCollapse Función que se ejecuta al colapsar ({})
 */
export default class FinsusDraggableBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      prevOffset: 0,
      topHeight: 0,
      bottomHeight: new Animated.Value(0),
      deviceHeight: Dimensions.get('window').height,
      isDividerClicked: false,
      pan: new Animated.ValueXY(),
      isVisible: this.props.visible,
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (e, gestureState) =>
        getDirection(gestureState) !== 'none',

      onPanResponderGrant: (e, gestureState) => {
        this.setState({
          offset: e.nativeEvent.pageY,
          prevOffset: e.nativeEvent.pageY,
          isDividerClicked: true,
        });
      },

      onPanResponderMove: (e, gestureState) => {
        let _height = 150;
        if (gestureState.moveY > this.state.deviceHeight - 50) _height = 50;
        else if (gestureState.moveY < this.props.expandedMargin)
          _height = this.state.deviceHeight - this.props.expandedMargin;
        else _height = this.state.deviceHeight - gestureState.moveY;

        this.setState({
          bottomHeight: new Animated.Value(_height),
          offset: e.nativeEvent.pageY,
        });
      },

      onPanResponderRelease: (e, gestureState) => {
        let _height = this.state.deviceHeight - e.nativeEvent.pageY;
        if (this.state.offset < this.state.prevOffset - 10)
          _height = this.state.deviceHeight - this.props.expandedMargin;
        else if (this.state.offset > this.state.prevOffset + 10) _height = 0;

        Animated.timing(this.state.bottomHeight, {
          toValue: _height,
          timing: 2000,
        }).start(() => {
          this.setState({offset: _height, isDividerClicked: false});

          // Invocar al método correspondiente
          if (_height > 150) {
            if (this.interval) clearInterval(this.interval);
            this.props.onExpand();
          } else if (_height < 150) {
            this.props.onCollapse();
          }
        });
      },
    });
  }

  componentDidUpdate() {
    // Si está visible, encender un timer
    if (this.props.visible && !this.interval) {
      // Mostrar gradualmente
      Animated.timing(this.state.bottomHeight, {
        toValue: this.props.collapsedHeight,
        timing: 1500,
      }).start(() => {
        this.setState({
          offset: this.props.collapsedHeight,
        });
      });

      this.interval = setInterval(() => {
        Animated.timing(this.state.bottomHeight, {
          toValue: 0,
          timing: 1500,
        }).start(() => {
          this.setState({offset: 100, isDividerClicked: false});
          this.props.onCollapse();
        });

        clearInterval(this.interval);
      }, this.props.duration);
    }
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    const closeBanner = () => {
      Animated.timing(this.state.bottomHeight, {
        toValue: 0,
        timing: 2000,
      }).start(() => {
        this.setState({offset: 100, isDividerClicked: false});
        this.props.onCollapse();
      });
    };

    return (
      this.props.visible && (
        <View style={styles.content}>
          {/* Divider */}
          <View style={{height: 24}}>
            <View
              style={{
                flex: 1,
                backgroundColor: this.state.isDividerClicked
                  ? PRIMARY_COLOR
                  : SECONDARY_COLOR,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 5,
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  width: 25,
                  height: 5,
                }}
              />
            </View>
          </View>

          {/* Bottom View */}
          <Animated.View
            {...this._panResponder.panHandlers}
            style={[
              {
                backgroundColor: '#fff',
                minHeight: 100,
              },
              {height: this.state.bottomHeight},
            ]}>
            <View style={{width: '100%', height: 30}}>
              <Icon
                name="close"
                size={24}
                color={SECONDARY_COLOR}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 15,
                  padding: 5,
                  marginBottom: 15,
                }}
                onPress={closeBanner}
              />
            </View>
            {this.props.children}
          </Animated.View>
        </View>
      )
    );
  }
}

FinsusDraggableBanner.propTypes = {
  visible: PropTypes.bool,
  collapsedHeight: PropTypes.number,
  expandedMargin: PropTypes.number,
  duration: PropTypes.number,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
};

FinsusDraggableBanner.defaultProps = {
  visible: false,
  collapsedHeight: 200,
  expandedMargin: 150,
  duration: 5000,
  onExpand: () => {},
  onCollapse: () => {},
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    elevation: 2,
    borderRadius: 50,
  },
});
