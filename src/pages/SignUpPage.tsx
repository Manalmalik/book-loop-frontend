import AuthForm from '../components/AuthForm'

function SignUpPage() {
  return (
    <div className='page-container'>
      <div className='page-header'>
        <div className="page-header-caption">
          <hr className="primary"/>
          <p> Create Your Account </p>
          <hr className="primary"/>
        </div>
       <div className='page-header-hero'>
            <h1> Sign Up </h1>
       </div>
      </div>
       <AuthForm/>
    </div>
  )
}

export default SignUpPage
