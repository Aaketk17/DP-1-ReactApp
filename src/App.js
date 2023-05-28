import {useEffect, useState, useRef} from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const URL = process.env.REACT_APP_SERVERLESS_URL

  const [tableData, setTableData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    getTableData()
  }, [])

  const getTableData = async () => {
    setLoading(true)
    await axios
      .get(`${URL}/read`)
      .then((results) => {
        console.log(results.data.result)
        if (results.data.result.length > 0) {
          setTableData(results.data.result)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const deleteRecord = async (id) => {
    console.log(id)
    setLoading(true)
    await axios
      .delete(`${URL}/delete/${id}`)
      .then((results) => {
        if (results.data.status_code === 200) {
          getTableData()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const submitData = async (data) => {
    setPostLoading(true)
    data.preventDefault()
    var name = document.getElementById('name').value
    var age = document.getElementById('age').value
    var gender = document.getElementById('gender').value
    var city = document.getElementById('city').value
    await axios
      .post(`${URL}/write`, {
        name: name,
        city: city,
        age: age,
        gender: gender,
      })
      .then((results) => {
        setPostLoading(false)
        setShowModal(false)
        getTableData()
        document.getElementById('user-data-form').reset()
      })
      .catch((error) => {
        setPostLoading(false)
        console.log(error)
      })
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <div className="App">
      <header class="p-3 bg-dark text-white">
        <div class="container">
          <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <div class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <span>Introduction to Cloud</span>
            </div>

            <div class="text-end">
              <span>By: Athavan</span>
            </div>
          </div>
        </div>
      </header>
      <div className="dataTable-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => setShowModal(true)}
            style={{marginBottom: '20px'}}
          >
            Add
          </button>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : tableData.length !== 0 ? (
          <div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">City</th>
                  <th scope="col">Age</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                {tableData.map((val) => {
                  return (
                    <tr>
                      <th scope="row">{val.id}</th>
                      <td>{val.name}</td>
                      <td>{val.city}</td>
                      <td>{val.age}</td>
                      <td>{val.gender}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteRecord(val.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{justifyContent: 'center', display: 'flex'}}>
            <span> No Data to show</span>
          </div>
        )}
      </div>
      {showModal && (
        <div
          class="modal fade show"
          role="dialog"
          tabindex="-1"
          style={{display: 'block'}}
        >
          <div class="modal-dialog" ref={modalRef}>
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Add User Data
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              {postLoading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
                <div class="modal-body">
                  <form onSubmit={submitData} id="user-data-form">
                    <div class="mb-3">
                      <label for="name" class="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        required
                      />
                      <div class="valid-feedback">Looks good!</div>
                      <div class="invalid-feedback">
                        Please choose a username.
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="age" class="form-label">
                        Age
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="age"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="city" class="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="city"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="gender" class="form-label">
                        Gender
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        id="gender"
                      >
                        <option value="male" selected>
                          Male
                        </option>
                        <option value="Female">Female</option>
                        <option value="Male">Not willing to say</option>
                      </select>
                    </div>
                    <div
                      style={{display: 'flex', justifyContent: 'space-between'}}
                    >
                      <button type="submit" class="btn btn-primary">
                        Submit
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
