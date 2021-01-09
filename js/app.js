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