import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import Login from './src/components/Login';
import TaskList from './src/components/Task';
import firebase from './src/services/connectFirebase';
import Icon from 'react-native-vector-icons/Feather';


export default function App() {
  const inputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {

    function getUser() {

      if (!user) {
        return;
      }

      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {

        setTasks([]);

        snapshot?.forEach((childItem) => {

          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }

          setTasks(oldTasks => [...oldTasks, data]);

        })
      })
    }

    getUser();

  }, [user]);

  function handleAdd() {
    if (newTask === "") {
      return;
    }

    if (key !== '') {

      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === key)
          let taskClone = tasks;
          taskClone[taskIndex].nome = newTask

          setTasks([...taskClone]);
        })

      Keyboard.dismiss();
      setNewTask('');
      setKey('');
      return;

    }

    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;

    tarefas.child(chave).set({
      nome: newTask
    })
      .then(() => {
        const data = {
          key: chave,
          nome: newTask
        };

        setTasks(oldTasks => [...oldTasks, data]);

      });

    Keyboard.dismiss();
    setNewTask("");

  }

  function handleDelete(key) {
    firebase.database().ref('tarefas').child(user).child(key).remove()
      .then(() => {
        const findTasks = tasks.filter(item => item.key !== key);
        setTasks(findTasks);
      })
  }

  function handleEdit(data) {

    setKey(data.key);
    setNewTask(data.nome);
    inputRef.current.focus();


  }

  function handleBack() {
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  }


  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />
  }


  return (
    <SafeAreaView style={styles.container}>

      {key.length > 0 && (
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name='x-circle' size={20} color="#FF0000" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, color: "#FF0000" }}>Você está editando uma tarefa !</Text>
        </View>
      )}


      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder='Tarefa'
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}
        />


        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit} />
        )}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#F2f6fc"
  },
  containerTask: {
    flexDirection: 'row',
    marginTop: 20
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  btnAdd: {
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 18,
    borderRadius: 4
  },
  btnText: {
    fontSize: 22,
    color: '#FFF'
  }
});
