<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <nav>
        <a href="{{route('homeway')}}">Homepage</a> <br />
        <a href="{{route('hobbyway')}}">Hobbies</a> <br />
        <a href="{{route('funfactway')}}">Fun Facts About Me</a>
    </nav>
<!-- changing part -->
  @yield("content")
<!-- end changing part -->


</body>
</html>