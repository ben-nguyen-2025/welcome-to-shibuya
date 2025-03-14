@extends("layout")
@section("content")

    <h1>Hi, my name is <u>Ben Nguyen</u>:</h1>
    <img src="{{asset("photos/headshot.png") }}" alt="image of ben nguyen" height="10%" width="10%"/>
    <br />
    <br />
    <a href="https://www.linkedin.com/in/benjamin-nguyen-09ab811a2/" target="_blank">
        <img
          width="10%"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png"
          alt="cat image"
        />
      </a>
    <h3>More about me:</h3>
    <p>
       <h4 class="paragraph">
        I'm a senior at TUJ studying Computer Science.
        I was born in Philadelphia, Pennsylvania (USA) and spent most of my life
        there. Before coming to study abroad at TUJ, I was
        a student at Temple University's main campus in Philadelphia.
       </h4>
    </p>
    <p>
        <h4 class="paragraph">
         I am Vietnamese-American and grew up with two siblings:
         an older brother and a twin sister. Both of them want to be doctors
         and are Neuroscience majors at other universities---I guess I'm a bit of a black sheep compared
         to them, haha. My dad works in software development
        and my mom was a pharmacist for over 20 years.
        </h4>
     </p>
     <div>
        <h3>Curious about me? Click to learn more!!</h3>

     </div>
     <div>
        <h3>Contact Me:</h3>
    <form action="https://google.com" target="_blank">
      <label for="first_name">
        First Name
        <input name="first_name" type="text" placeholder="enter first name here" />
      </label>
      <br />
      <label for="last_name">
        Last Name
        <input name="last_name" type="text" placeholder="enter last name here" />
      </label>
      <br />
      <br />
      <label for="background_student">
        Student <input type="checkbox" name="background" id="background_student"/>
      </label>
      <label for="background_research">
        Researcher <input type="checkbox" name="background" id="background_research"/>
      </label>
      <br />
      
      <h4>Type of Inquiry:</h4>
      <!-- match for with id of input-->
      <!-- if you want a radio button for two separate 
          questions you must give the two different groups 
          separate names-->
      <label for="research">
        research
        <input type="radio" name="inquiry_type" id="research" value="research" />
      </label>
      <label for="business">
        business
        <input type="radio" name="inquiry_type" id="business" value="business" />
      </label>
      <label for="other">
        other
        <input type="radio" name="inquiry_type" id="other" value="other" />
      </label>
      <br />
      <h4><i>if you pressed 'other', please denote the reason below:</i></h4>
      <label for="reason">
        <input type="text" name="inquiry_type" id="reason" placeholder="enter reason here" />
      </label>

      <h3>upload cv/resume (optional)</h3>
      <input type="file" name="inquiry_file" id="inquiry_file" />
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
     </div>
@endsection
