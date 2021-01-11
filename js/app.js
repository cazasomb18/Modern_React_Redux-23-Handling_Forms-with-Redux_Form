////////////////////////////////////////////////////////////////////////////////////////////////////
//Important Note about Redux Form Installation:

	/*In the upcoming lecture, we will be installing Redux Form into our application. If you are 
	using the latest Node v15 and npm v7 releases, this will fail with the following error:

	code ERESOLVE

	npm ERR! ERESOLVE unable to resolve dependency tree

	This is caused by some fairly significant breaking changes NPM is making, which can read about here:*/

	//https://blog.npmjs.org/post/626173315965468672/npm-v7-series-beta-release-and-semver-majory

	//If you are using NPM, you'll need to run this command instead:
		//npm install redux-form --legacy-peer-deps
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Forms with Redux Form 
	
	//We'll start working on our StreamStream form:
		//When we submit form:
			//Reach out to API server
				//--> create new record stating that user has put together a new stream

	//Redux-Form library:
		//can be challenging
		//does a ton of stuff for you that can make stuff easier

	//So let's install redux form into our project:
		//npm install --save redux-form 

	//HANDLING INPUTS WITHOUT REDUX:
		//Making use of class-based component w/ component level state
		//took value from state{} and pushed it into value of input Element in the DOM
		//--> idea: tell the input element what it's value was, and store no data inside DOM
		//When user changed text - we'd call an onChange cb, cb would update state on component
		//--> class-based component holds the 'true' value of the form element

	//Here's how we were handling forms before:
		//Class Component							DOM
			//state 		--> 	-->				value 	:	<--[INPUT]
			//setState 		<--		<--				onChange:	<--[INPUT]
			//													<--[ELEMENT]


	//HANDLING INPUTS WITH REDUX FORM:
		//Input element: assigned value and onChange handler by our applicaiton
			//-> we never let DOM hold info about our app, we hold it push it into the DOM.
		//All of our form data will be held in the redux store, 
		//Will be maintained by a reducer
		//To make sure we can get data from store into our input elements:
			//mapStateToProps: will take form data and place into our component as props
				//--> take props obj w/ values and pass them into our input elements as value
			//--> any time a use makes a change to an E we'll have a cb handler inside our comp
				//that'll call an action creator and try to update our Redux Store

	//REDUX-STORE										COMPONENT 		DOM
		//redux form --> redux form mapStateToProps --> [props]   --> 	 value 	 :[INPUT]
		//reducer 	 <-- redux form Aciton Creator  <-- [handler] <--	 onChange:[ELEMENT]

		//HERE'S THE CRAZY THING:  Redux-Form will do most of this for us!!
			//Redux-form has a reducer taht we'll wire up to our app, WE DON'T WRITE THIS REDUCER
			//--> we'll wire this reducer up to our store
			//--> we don't have to write mapStateToProps (redux-form does it automatically) 
			//--> we dont' write any action creators (redux-form does it automatically)
			//What we have to do:
				//1 - make sure eventually get some form info into our given input element
				//2 - make sure element understand it needs to call some cb handler (provided by redux-form)
				//any time is gets changed
////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////
//Useful Redux-Form Examples

	//Redux-Form documentation is OUSTANDING, let's check out some of it so we can reference it later:

	//redux-form.com > examples:
		//here you'll find all types of examples for different types of forms:
			//simple form
			//synchronous validation (client side)
			//validation only when user submits a form
			//initializing from state (edit forom)
			//wizard form - most useful:
		//Wizard Form:
			//this is a multi-step form, you'll want to read about this approach for future apps

		//Synchronous Validation:
			//--> this is what we'll be using for our form
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Connecting Redux Form

	//we're wiring up a reducer that's already been created when we installed redux-form
	//src/reducers/index.js:
		import { combineReducers } from 'redux';
		import { reducer as formReducer } from 'redux-form';//renaming reducer as form Reducer

		import authReducer from './authReducer'

		export default combineReducers({
			auth: authReducer,
			form: formReducer//--> export to reducers as form
		});

	//Now let's check it our in redux-dev tools [state] tab, 'tree':
		//auth: {
			// isSignedIn: true,
			// userId: '230987634059867354098'
			//}
		//form: {  }
////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating Forms
	//We'll be working on StreamCreate Form:
		//make sure we can see stream create @ localhost:3000/streams/new:
			//--> should see 'StreamCreate'

	//in src/components/streams/StreamCreate.js:
		//1. refactor functional comp into class-based component
		//2. import redux form
			import { Field, reduxForm } from 'redux-form';
				//Field: React Component </>
				//reduxForm: function that allows us to call an action creator and get data into our
					//form component
		//3. Take reduxForm function and hook it up to our component:
			//reduxForm very similar to connect (connect({state, reducer})(Component))
				export default reduxForm({
					form: 'streamCreate'
				})(StreamCreate);
		//4. Component StreamCreate will not be passed a lot of props it did not have before:
			//when we console.log(this.props) browser console will reveal all these props:
			//It's now up to use to find the props we want to make use of them to build our form
				<Field name="title" />
					//name: name of prop that this field will manage, 1st input is 'title'
				//<Field /> does not know how to render anything on screen:
					//--> component that's part of the system that will automatically handle 
					//all the form input
						//doesn't know how to render anything by itself - will throw an error!
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Automatically Handling Events

	//Current error: 'Element type is invalid: expected a string or a class/function but got: undefined.'
		//reason: <Field/> doesn't know how to show any form elements
			//we have to assign a prop to the <Field name="title" component={} /> to show a DOM Element

	//src/components/streams/CreateStream.js:
		class StreamCreate extends React.Component{

			renderInput(formProps) {
				console.log(formProps);
				return (
					<input 
						onChange={formProps.input.onChange} 
						value={formProps.input.value}
					/>
				);
			}

			render(){
				return(
					<div>
						<form>
							<Field name="title" component={this.renderInput} />
							<Field name="description" component={this.renderInput} />
						</form>
					</div>
				); 
			};
		};//when we do this, each <Field/> renders an input element on the screen twice

	//Remember, whenever we show an input element, we have to assign it's value prop and give it an onChange
	//cb handler
		//redux dev tools: 
			//left panel: registers all redux-form/CHANGE cbs when we type into either <Field/>
			//state/tree selectors: 
				// form {
				// 	streamCreate {
				// 		values:
				// 			title: 'asdf'
				// 			description: 'asdf'
				// 	}
				// }
			//this is how redux-form stores data inside of our reducer that we wired up to the
			//combineReducers call:
				//every time you create a new form, pass in 'name'
					//redux form stores values for that form on a key w/ that 'name' inside that reducer
						//--> inside of there will be the values

	//Redux-form is now handling text input from the two <input/>s:
		//we did this by taking 2 props out of the formProps arg and passing them into the input
		//argument for the onChange and value properties
			//in documentation there's a shorter way to do this?

	//Shortened Syntax:
		renderInput(formProps) {
			console.log(formProps);
			return (
				<input {...formProps.input}/>
			);
		}//functions in the same way as renderInput(formProps){} above

	//We can further shorten this syntax by destructuring out the 'input' prop from formProps:
		renderInput({ input }) {
			console.log(formProps);
			return (
				<input {...input}/>
			);
		};
	//Now when we call renderInput() we'll pass input into the onChange and value props of <input/>

	//Entire component now looks like this:
		import React from 'react';
		import { Field, reduxForm } from 'redux-form';

		class StreamCreate extends React.Component{
			renderInput({input}) {
				console.log("formProps: ", formProps);
				return(
					<input {...input}/>
				);
			}
			render(){
				return(
					<div>
						<form>
							<Field name="title" component={this.renderInput} />
							<Field name="description" component={this.renderInput} />
						</form>
					</div>
				); 
			};
		};
		export default reduxForm({
			form: 'streamCreate'
		})(StreamCreate);
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Customizing Form Fields

	//Now we need to wire up the value provided by redux-form and connect them to some meaningful input

	//It's now hard for a user to figure out what's going on, so let's return an entire blob of jsx:
	//src/components/streamCreate: renderInput():
		class StreamCreate extends React.Component{
			renderInput({ input, label }) {//destructure out label property
				return(
					<div className="field">
						<label>{label}</label>
						{/*value ^^^ of label inserted here*/}
						<input {...input}/>
					</div>
				);
			}
			render(){
				return(
					<div>
						<form className="ui form">
							<Field name="title" component={this.renderInput} label="Enter Title" />
							<Field name="description" component={this.renderInput} label="Enter Description"/>
						</form>
					</div>
				); 
			};
		};//now our label appears on the screen w/ the strings assigned to label prop in <Field/>s
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Handling Form Submission

	//Let's put together an onSubmit helper method, src/components/streams/CreateStream:
		//when you console.log(this.props):
			//-->can see the 'handleSubmit' prop: called anytime form gets submitted w/ redux/form:

			onSubmit(formValues){
				console.log(formValues);
			}
			render(){
				return(
					<div>
						<form className="ui form" onSubmit={this.props.handleSubmit(this.onSubmit)} >
							<Field name="title" component={this.renderInput} label="Enter Title" />
							<Field name="description" component={this.renderInput} label="Enter Description"/>
							<button className="ui button primary">Submit</button>
						</form>
					</div>
				);
			};
		//handleSubmit: cb provided to our component by redux-form
			//--> then called this w/ our callback method onSubmit(){}
			//this changes how onSubmit gets called:
				//handleSubmit automatically received the 'e' object and automatically invokes
				//preventDefault() for us --> we onSubmit(){} will have NO EVENT OBJECT

	//Event object is now useless:
		//now when we console.log(formValues) we can see those values we entered into the form
		//when we click on the 'submit' button!
	//Now, if we click submit w/o entering anything into the fields we are still handling this form,
		//next let's change this so that a user will not be able to create a stream without entering
		//a title and description - let's VALIDATE these text inputs
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Validation of Form Inputs

	//We need to make it so user cannot submit a form w/o entering a 'title' AND 'description'
		//validation: makes sure user's input is a 'valid' input

	//Form is initially renderd OR user interacts with it:
		//validate function gets called w/ all values from the form
			//we have to define "validate"
		//validate(formValues)
			//--> did the user enter valid inputs?
				//YES:
					//--> return an empty object {}
						//returning {} --> makes redux form think our form is valid
				//NO:
					//--> return object: for each invalid field, put a key-value pair on the object with
					//the NAME of the field and the error message
						//errors = {title: 'You must enter a title'}
			//--> Redux Form rerenders our component
			//--> Each 'field' rendered w/ the error message from the 'errors' object
	//in src/components/streams/CreateStream:
		const validate = (formValues) => {
			const errors = {};
			if (!formValues.title) {
				//only ran if the user did not enter a title
				errors.title = 'You must enter a title';
			}
			if (!formValues.description) {
				//only ran if user did not enter a description
				errors.title = 'You must enter a description';
			}
			return errors;
		};
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Display Validation Messages (Form Error Handling):

	//Need to make sure validate function gets wired up to reduxForm so that it knows to use the 
	//validate function:
		export default reduxForm({
			form: 'streamCreate', 
			validate: validate
		})(StreamCreate);

	//^^^ We just put together our validate function, and wired it up to the component ^^^
		//If error object has a property name === to the <Field name=''/>, then the validate
		//function automatically returns the error object associated w/ that field name!
			//this is found on the 'meta.error' property of the formValues object:
				//--> we we'll destructure out the 'meta' and render it underneath the <label/>
					//this will render the error messages on screen to the user if they make
					//an invalid input

	//src/components/streams/CreateStream.js, component now looks like this:
		class StreamCreate extends React.Component{
			renderInput({ input, label, meta }) {
				return(
					<div className="field">
						<label>{label}</label>
						<br/>
						<input {...input}/>
						<div>{meta.error}</div>
					</div>
				)
			};
			onSubmit(formValues){
				console.log(formValues);
			};
			render(){
				return(
					<div>
						<form className="ui form" onSubmit={this.props.handleSubmit(this.onSubmit)} >
							<Field name="title" component={this.renderInput} label="Enter Title" />
							<Field name="description" component={this.renderInput} label="Enter Description"/>
							<button className="ui button primary">Submit</button>
						</form>
					</div>
				)
			};
		};
		const validate = (formValues) => {
			const errors = {};
			if (!formValues.title) {
				errors.title = 'You must enter a title';
			}
			if (!formValues.description) {
				errors.description = 'You must enter a description';
			}
			return errors;
		};
		export default reduxForm({
			form: 'streamCreate', 
			validate: validate
		})(StreamCreate);
		//NEXT: we want the error messages only to render when user submits the form w/ an invalid input!
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Showing Errors on Touch

	//GOAL: only show error message after user clicks on field, enters text, and then clicks out of it
		//click on field === 'focused'
			//this is a better way to communicate errors, doesn't require form submission

	//if we console.log(meta) again:
		//we can see that there's a 'touched' property that returns true/false
			//--> we're going to use this to return an error message

	//So let's add some logic to determine this in new method renderError:
		renderError({ error, touched }) {
			if (touched && error) {
				return (
					<div className="ui error message">
						<div className="error">{error}</div>
					</div>
				);
			}
		};
	//And now call it underneath the label in renderInput method (change renderInput to af!!):
		renderInput = ({ input, label, meta }) => {
			return(
				<div className="field">
					<label>{label}</label>
					<input {...input} autoComplete="off" />
					{this.renderError(meta)}
				</div>
			);
		};
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Highlighted Error Fields 

	//Error messaging isn't showing up b/c of semantic ui className:
		//--> add 'error' to end of className (className = "ui form error"):
			{<form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}></form>}
				//NOW WE HAVE OUR ERROR MESSAGES RENDERING THE WAY WE WANT THEM!

	//Let's do one extra step to make the field itself red in case there's an error, in renderInput:
		//logic to decide whether or not we want to show our error message:
			renderInput = ({ input, label, meta }) => {
				const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
				//if there's an error and it was touched interpolate:'error' otherwise interpole: ''
				return(
					<div className={className}>
						<label>{label}</label>
						<input {...input} autoComplete="off" />
						{this.renderError(meta)}
					</div>
				);
		//Now we have entire field and error message rendering under the right conditions!

	//Now we need to work on onSubmit(){} to make sure it's acutally pinging our api:
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating Streams

	//What are we doing once user submits the form?

	//We're going to focus on the overall architecure of our project:

	//Remember this diagram (appArchitecture.png)?
										//APIServer that knows
										//which streams are
										//broadcasting		--> [Viewer's Browser]
//											^^^					[ReactApp that can] 
//											^^^					[create and browse] 
//											^^^						[streams]	
	//Streamer's Computer: running OBS --> [RTMP Server] 	<-- [Viewer's Browser]
//		creating stream: id 2			show me streamid: 2


	//API Server: has a plain list of records, each record will represent one stream:
		// {id: 1, title: 'My Stream', description: 'some stream'}
		// {id: 2, title: 'Code Stream', description: 'Coding'}

	//Streamer running OBS: I am creating stream id 2
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//REST-ful Conventions

	//We're going to have to start working on the API Server