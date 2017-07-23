import Constants from './contants';

module.exports = {
  headerStyle: {
    backgroundColor: Constants.colors.blue
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row2: {
    flexDirection: 'row'
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
  },
  rowBox: {
    margin: 16,
    marginBottom: 0,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Constants.colors.yellow
  },
  rowBoxTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: Constants.colors.orange
  },
  rowBoxContent: {
    flexDirection: 'row'
  },
  rowBoxContentText: {
    fontSize: 16,
    color: Constants.colors.blue,
    marginLeft: 5,
    marginRight: 10
  },
  rowBoxContentTextNoMargin: {
    fontSize: 16,
    color: Constants.colors.blue
  },
  rowBoxPicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    backgroundColor: Constants.colors.orange,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowBoxPictureLabel: {
    fontSize: 18,
    color: '#FFF'
  },
  squareBox: {
    flex: 0.5,
    margin: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Constants.colors.yellow
  },
  squareBoxTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: Constants.colors.orange
  },
  squareBoxRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  squareBoxContent: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  squareBoxContentText: {
    fontSize: 16,
    color: Constants.colors.blue,
    marginLeft: 5,
    marginRight: 10
  },
  squareBoxContentTextNoMargin: {
    fontSize: 16,
    color: Constants.colors.blue
  }
};
