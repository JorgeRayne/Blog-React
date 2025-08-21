function Nav({ search, setSearch}) {
  return (
    <nav className="Nav">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search">Search Post</label>
          <input
            id="search" 
            type="text"
            placeholder="Search Post"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
    </nav>
  )
}

export default Nav