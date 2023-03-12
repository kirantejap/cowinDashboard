import Loader from 'react-loader-spinner'
import {Component} from 'react'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    coverageList: [],
    byAgeList: [],
    byGenderList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const coverageData = fetchedData.last_7_days_vaccination.map(
        eachCoverage => ({
          vaccineDate: eachCoverage.vaccine_date,
          dose1: eachCoverage.dose_1,
          dose2: eachCoverage.dose_2,
        }),
      )
      this.setState({
        coverageList: coverageData,
        byAgeList: fetchedData.vaccination_by_age,
        byGenderList: fetchedData.vaccination_by_gender,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccess = () => {
    const {coverageList, byAgeList, byGenderList} = this.state

    return (
      <div className="charts-container">
        <VaccinationCoverage coverageDetails={coverageList} />
        <VaccinationByGender byGenderDetails={byGenderList} />
        <VaccinationByAge byAgeDetails={byAgeList} />
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="logo-name">Co-WIN</h1>
        </div>
        <h1 className="head">CoWIN Vaccination in India</h1>
        {this.renderSwitch()}
      </div>
    )
  }
}

export default CowinDashboard
