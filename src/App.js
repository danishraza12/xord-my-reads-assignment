import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Header from './components/Header';
import BookShelves from './components/BookShelves';
import DisplaySearches from './components/DisplaySearches';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class BooksApp extends React.Component {
  state = {
    showSearchPage: false,
    fetchedBooks: []
  }

  /** Function is used to update state so that page can be changed */
  onButtonClick = event => {
    this.setState({ showSearchPage: event })
  }

  /** Fetches all the books that we have on our shelves from the API */
  async componentDidMount() {
    const response = await BooksAPI.getAll()
    if (response.error) {
      console.log("Network Error...")
    }
    this.setState({ fetchedBooks: response })
  }

  /** This function updates the API to match our selections on the home page */
  changeBookShelf = (book, shelf) => {
    BooksAPI.update(book, shelf)
    if (shelf === 'none') {
      this.setState(prevState => ({
        fetchedBooks: prevState.fetchedBooks.filter(b => b.id !== book.id)
      }))
    } else {
      book.shelf = shelf
      this.setState(prevState => ({
        fetchedBooks: prevState.fetchedBooks.filter(b => b.id !== book.id).concat(book)
      }))
    }
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/search">
              <DisplaySearches
                onButtonClick={this.onButtonClick}
                changeBookShelf={this.changeBookShelf}
                fetchedBooks={this.state.fetchedBooks}
              />
            </Route>
          </Switch>
          <div className="list-books">
            <Switch>
              <Route exact path="/">
                <Header />
                <BookShelves
                  books={this.state.fetchedBooks}
                  onShelfChange={this.changeBookShelf}
                />
              </Route>
            </Switch>

            <div className="open-search">
              { /**This will return true if the button is clicked and 
                 * we will move to the Search Page */ }
              <Link to="/search">
                <button>Add a book</button>
              </Link>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default BooksApp;
