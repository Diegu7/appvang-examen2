import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import axios from 'axios';


class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      search: '',
    };
  }

  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Search Job</Text>
        <TextInput
          style={styles.textInput}
          placeholder={'search'}
          onChangeText={(txt) => this.setState({txt})}
          value={this.state.search}
        />
        <Button
          style={styles.button}
          title="Search"
          onPress={ () => this.props.navigation.navigate('List',{keywords: this.state.search})}
        />
      </View>
    );
  }
}

class ListScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      keywords: this.props.navigation.getParam('keywords', ''),
      jobs: []
    }
  }

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    axios
      .get(`https://jobs.github.com/positions.json?search=${this.state.keywords}`)
      .then(resp => {
        this.setState({jobs: resp.data});
      })
      .catch(err => {console.warn(err.message);})
  }

  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Job List</Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.state.jobs.map((job) =>
            <View style={styles.box} key={job.id}>
              <Text styles={styles.jobTitle}>{job.title}</Text>
              <Text styles={styles.jobCompany}>{job.company}</Text>
              <Text styles={styles.jobType}>{job.type}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={styles.screen}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    List: ListScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  textInput: {
    color:'white',
    height:40,
    width:280,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal:20,
    paddingHorizontal:10,
  },
  box: {
    height: 75,
    width: 300,
    alignSelf:'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 20,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
  },
  jobTitle: {
    fontSize: 15,
    paddingVertical: 10,
    fontWeight: 'bold',
  },
  jobType: {
    fontSize: 10,
    paddingVertical: 5,
  },
  jobCompany: {
    fontSize: 10,
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 10,
  },
});


const AppContainer = createAppContainer(AppNavigator);


export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}