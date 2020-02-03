import React, {Component} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Database} from '../../config/initialize';
import {withNavigation} from 'react-navigation';

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    userList: [],
    refreshing: false,
    uid: '',
  };
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid: uid, refreshing: true});
    await Database.ref('/users').on('child_added', data => {
      let person = data.val();
      if (person.uid_users != uid) {
        this.setState(prevData => {
          return {userList: [...prevData.userList, person]};
        });
        this.setState({refreshing: false});
      }
    });
  };

  renderItem = ({item}) => {
    return (
      <SafeAreaView style={{marginBottom: 3}}>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => this.props.navigation.navigate('Chat', {item})}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              marginHorizontal: 10,
              borderTopColor: 'white',
              borderTopWidth: 2,
            }}>
            <Image
              source={{uri: item.photo_users}}
              style={{
                height: 60,
                width: 60,
                backgroundColor: '#A2A7C0',
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#757EE3',
                top: 10,
              }}
            />
            <View style={{justifyContent: 'center', marginLeft: 10, flex: 1}}>
              <View style={{top: 7, justifyContent: 'center'}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  {item.username}
                </Text>
                <Text>{item.email_users}</Text>
              </View>
              <View />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={{left: -10, color: '#757EE3'}}>{item.status}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#7C80EE" />
        <View style={{backgroundColor: '#E5EDF9', flex: 1}}>
          <SafeAreaView>
            {this.state.refreshing === true ? (
              <ActivityIndicator
                size="large"
                color="#05A0E4"
                style={{marginTop: 150}}
              />
            ) : (
              <FlatList
                style={{marginTop: 20}}
                data={this.state.userList}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </SafeAreaView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  root: {},
  profilePic: {
    height: 50,
    width: 50,
    backgroundColor: '#eddbb9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  listChat: {
    padding: 20,
    marginBottom: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  personChat: {
    color: '#1f1f1f',
  },
});
