# Material2 w/ Angular-CLI Webpack

A few months ago I tried my hand at angular-cli. It was nice but it had enough problems for me to stay away until 
the team [worked some things out](https://github.com/angular/angular-cli/issues/909). Foremost was the incredibly 
slow app refresh during the development experience due to SystemJS loading every file dynamically - RequireJS anyone?

All the efficiency gains made with the cli scaffolding were quickly offset by the painfully slow app refreshes. 

So the whole idea of the CLI is to speed scaffolding only to slam on the brakes during development. 

So was I ever delighted to see the team 
[moved the build system from SystemJS to Webpack](https://github.com/angular/angular-cli/blob/master/CHANGELOG.md#100-beta11-webpack-2016-08-02)!! 
BOOM!!

What a great improvment to the CLI. 

There's still the matter of [overriding Webpack configuration](https://github.com/angular/angular-cli/issues/1656), 
but we'll leave that for another day. In the meantime we 
delivers these benefits:

 - Webpack config out of the box
 - Super fast app refreshes
 - Reduced configuration

I've been holding off off on Angular-CLI until they made the move to Webpack. (Thank You!!!)
So I gave Angular-CLI beta-11 ("angular-cli": "1.0.0-beta.11-webpack.2") a test run with 
Material2 alpha-7-4 ("@angular2-material/core": "^2.0.0-alpha.7-4")

I wrote this post because portions of the [Material 2 Getting Started](https://github.com/angular/material2/blob/master/GETTING_STARTED.md) 
page are outdated and there are a few workarounds.  

You can skip: Add components to vendor bundle andConfigure SystemJS from "GETTING_STARTED.md"
The only thing which I noticed is not working is Additional setup for md-menu and md-tooltip

There are still a few minor bumps but this combination is starting to mature. Here's my experience and few
issues that you need to work through.  

# Setup Angular-CLI app

## Install angular-cli@webpack
If you previously installed `angular-cli`, then remove the old version and clean npm cache.

```
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@webpack
``` 

## Generate a New App

```
ng new PROJECT_NAME
cd PROJECT_NAME
ng serve
```


### UNMET PEER DEPENDENCY typescript@2.0.0 Error

When creating a new app `ng new` you may see the following error. 

![Unmet Peer Dependency typescript@2.0.0](http://link)

This error [seems to be erroneous](https://github.com/angular/angular-cli/issues/1737#issuecomment-240703690). 
The app seems to behave properly. 



# Setup Material 2 

Install Material Core, Button, Card, Checkbox and Radio
```
npm install --save @angular2-material/core @angular2-material/button @angular2-material/card @angular2-material/radio @angular2-material/checkbox
```

Add Material Modules to the App

```
// app.module.ts
import { MdCoreModule } from '@angular2-material/core'
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdRadioModule } from '@angular2-material/radio';

...
@NgModule({
  ...
  imports: [
    ...
    MdCoreModule, MdCardModule, MdButtonModule, MdCheckboxModule, MdRadioModule
  ],
  ...
})
```

And the HTML Component

```
<div class="app-content">
  <h1>{{title}}</h1>
  <md-card>
    <button md-button>FLAT</button>
    <button md-raised-button md-tooltip="This is a tooltip!">RAISED</button>
    <button md-raised-button color="primary">PRIMARY RAISED</button>
    <button md-raised-button color="accent">ACCENT RAISED</button>
  </md-card>

  <md-card>
    <md-checkbox>Unchecked</md-checkbox>
    <md-checkbox [checked]="true">Checked</md-checkbox>
    <md-checkbox [indeterminate]="true">Indeterminate</md-checkbox>
    <md-checkbox [disabled]="true">Disabled</md-checkbox>
  </md-card>
    
  <md-card>
    <md-radio-button name="symbol">Alpha</md-radio-button>
    <md-radio-button name="symbol">Beta</md-radio-button>
    <md-radio-button name="symbol" disabled>Gamma</md-radio-button>
  </md-card>
</div>
```

## errors


### HammerJS Error 

```
ERROR in [default] /material-app/node_modules/@angular2-material/core/gestures/MdGestureConfig.d.ts:4:39
Cannot find name 'HammerManager'.
```

#### Solutions

Material 2 does not install hammerjs, so here are a couple solutions that together solve the problem. 

**Solution 1**
Angular member David East provided [this solution](https://github.com/angular/material2/issues/535#issuecomment-241140049) below:

In your `tsconfig.json` you need to enable the `skipLipCheck' option. This keeps TypeScript from type 
checking library code that is presumably already type checked. 

NOTE: This only fixed issues when importing button, checkbox, radio. 

```
// tsconfig.json
"skipLibCheck": true

// then restart Webpack
```


## Add Material Slider

Install Material Slider
```
npm install --save @angular2-material/slider
```

Add Material Slider Module to the App
```
// app.module.ts
...
import { MdSliderModule } from '@angular2-material/slider';

...
@NgModule({
  ...
  imports: [
    ...
    MdCoreModule, MdCardModule, MdButtonModule, MdCheckboxModule, MdRadioModule, MdSliderModule
  ],
  ...
})
```

Add the slider to the HTML Component

```
<!-- app.component.html -->
<div class="app-content">
  <h1>{{title}}</h1>
  <!-- 
  ...
  -->
  <md-card>
    <md-slider min="1" max="5"></md-slider>
  </md-card>

</div>
```

### Error: Hammer.js is not loaded

```
 Hammer.js is not loaded, can not bind slide event
```

Now we see `hammerjs` rearing it's ugly head again. This time it's a runtime error because, well... hammerjs does not get 
installed even though Material 2 has a Dependency on `"hammerjs": "^2.0.8"` we need to do the install manually. 

**Solution 2**
When importing `slider`, got addtional errors that could only be fixed with the [following steps](https://github.com/angular/material2/issues/535#issuecomment-240966608):

1. npm install --save hammerjs
1. npm install --save @types/hammerjs
1. Add `import 'hammerjs'` to `app.module.ts` file
1. Copied the overlay styles.css into my own CSS, as I've yet to figure out how I'm supposed to reference vendor styles in the node_modules directory in the new CLI build system.


