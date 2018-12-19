import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import axios from 'axios';

const regex = /<\/?[^>]+(>|$)/g;

class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Search Job',
  };

  constructor(props){
    super(props);
    this.state = {
      search: '',
    };
  }

  render() {
    return (
      <View style={styles.screen}>
        <TextInput
          style={styles.textInput}
          placeholder={'search'}
          onChangeText={(txt) => this.setState({search: txt})}
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
  static navigationOptions = {
    title: 'Job List',
  };

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
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.state.jobs.map((job) =>
            <TouchableOpacity 
              style={styles.box} 
              key={job.id}
              onPress={ () => this.props.navigation.navigate('Details',{job: job})}
            >
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobType}>{job.type}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Job Details',
  };

  constructor(props){
    super(props);
    let temp = this.props.navigation.getParam('job', '');
    let desc = temp.description.replace(regex, '');
    this.state = {
      job: temp,
      description: desc,
    }
  }

  render() {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>{this.state.job.title}</Text>
          <Text style={[styles.jobCompany, {fontSize: 16}]}>{this.state.job.company}</Text>
          <Text style={[styles.jobType, {fontSize: 16}]}>{this.state.job.type}</Text>
          <Text style={styles.description}>{this.state.description}</Text>
        </ScrollView>
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
    height:40,
    width:280,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal:20,
    paddingHorizontal:10,
  },
  box: {
    height: 85,
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
    paddingVertical: 2,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  jobType: {
    fontSize: 10,
    color: 'gray'
  },
  jobCompany: {
    fontSize: 13,
  },
  button: {
    paddingVertical: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'justify',
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