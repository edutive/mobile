import Constants from './contants';

module.exports = {
  headerStyle: {
    backgroundColor: Constants.colors.blue
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    color: Constants.colors.orange
  },
  inputArea: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Constants.colors.orange
  },
  input: {
    height: 40
  },
  buttonOragen: {
    borderRadius: 4,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: Constants.colors.orange
  },
  buttonDark: {
    backgroundColor: Constants.colors.dark,
    borderRadius: 5,
    padding: 10,
    marginTop: 20
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF'
  }
};
