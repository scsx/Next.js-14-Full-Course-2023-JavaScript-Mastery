'use client'

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [allPosts, setAllPosts] = useState([])

  // Search states
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState([])
  const [tagsCount, setTagsCounter] = useState([])

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt')
    const data = await response.json()

    setAllPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Extra: show tags by usage count.
  useEffect(() => {
    const allTags = []
    const allTagsCombined = []
    const countsObj = {}

    allPosts.map((i) => allTags.push(i.tag)) // ['#mongodb', '#regex', '#dutch', '#dutch', '#dutch', '#mongodb', '#dutch']

    for (let num of allTags) {
      countsObj[num] = countsObj[num] ? countsObj[num] + 1 : 1 // {#mongodb: 2, #regex: 1, #dutch: 4}
    }

    for (let tag in countsObj) {
      allTagsCombined.push([tag, countsObj[tag]])
    }

    allTagsCombined.sort((a, b) => {
      return b[1] - a[1]
    })

    setTagsCounter(allTagsCombined)
  }, [allPosts])

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, 'i') // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchedResults(searchResult)
      }, 500)
    )
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompts(tagName)
    setSearchedResults(searchResult)
  }

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}

      {/* Extra: show tags by usage count. */}
      <h3 className='subhead_text orange_gradient text-center'>All tags</h3>
      <div className='toptags'>
        {tagsCount.map((tag) => (
          <div className='toptags__tag' key={tag[0] + tag[1]}>
            {tag[0]}
            <span>{tag[1]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Feed
