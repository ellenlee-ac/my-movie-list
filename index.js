(function () {
  const BASE_URL = 'http://movie.spreered.com'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const paginationUl = document.getElementById('pagination')
  let paginationData = []

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    displayPagination(1, data)
  }).catch((err) => console.log(err))

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  searchBtn.addEventListener('click', event => {
    let resultData = []
    event.preventDefault()
    const regex = RegExp(searchInput.value, 'i')
    resultData = data.filter(item => item.title.match(regex))
    displayPagination(1, resultData)
  })

  paginationUl.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      displayPagination(event.target.dataset.page)
    }
  })

  function displayDataList (dataList) {
    let htmlContent = ''
    dataList.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</i></button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie (movieId) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    const url = INDEX_URL + movieId
    console.log(url)
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem (id) {
    const dataStorage = JSON.parse(localStorage.getItem('favoriteMovie')) || []
    const index = data.findIndex(item => item.id == id)
    const obj = data[index]
    if (!dataStorage.some(item => item.id == data[index].id)) {
      dataStorage.push(obj)
      alert(`Added ${obj.title} to favorite successfully !`)
    }
    localStorage.setItem('favoriteMovie', JSON.stringify(dataStorage))
  }

  function displayPagination (pageNum, dataList) {
    paginationData = dataList || paginationData

    // render pagination li
    let liContent = ''
    let totalPages = Math.ceil(paginationData.length / 10)
    for (let i = 0; i < totalPages; i++) {
      liContent += `<li class="page-item"><a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a></li>`
    }
    paginationUl.innerHTML = liContent

    // display pagination data
    if (pageNum > totalPages) return
    const ITEM_PER_PAGE = 10
    const offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
})()
