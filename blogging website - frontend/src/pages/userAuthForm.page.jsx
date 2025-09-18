import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
const UserAuthForm = ({type}) => {
  return (
    <AnimationWrapper keyValue={type}>
    <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px] ">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                {type=="sign-in"?"Welcome back":"Join us now "}
            </h1>
            {
                type!= "sign-in" ? <InputBox 
                name="fullname" type="text"  placeholder="Full Name" icon="fi-rr-user"
                /> 
                : ""
               
            }
             <InputBox 
               name="email" type="email"  placeholder="Email" icon="fi-rr-envelope"
               />
                <InputBox   
               name="password" type="password"  placeholder="Password" icon="fi-rr-lock"
               />
               <button className="btn-dark center mt-14" type="submit">
                {type=="sign-in"?"Sign In":"Sign Up"} 
               </button>
               <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                <hr className="w-1/2 border-black"></hr>
                <p>or</p>
                <hr className="w-1/2 border-black"></hr>
               </div>
               <button className="btn-dark flex items-center justify-center gap-4 w-full center" type="button">
                <img src={googleIcon} className="w-5"></img>
                 continue with google
                 </button>
                 {
                    type=="sign-in"
                    ? <p className="mt-6 text-dark-grey text-xl text-center">Dont't have an account ?
                        <Link to="/signup" className="text-black underline text-xl ml-1">
                         join now
                        </Link>
                    </p>
                    :
                    <p className="mt-6 text-dark-grey text-xl text-center">Already have an account ?
                        <Link to="/signin" className="text-black underline text-xl ml-1">
                            Sign In here
                        </Link>
                    </p>
                 }

        </form>

    </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm;