@extends("blog.layout")
@section("content")
    <header class="py-5 bg-light border-bottom mb-4">
        <div class="container">
            <div class="text-center my-5">
                <h1 class="fw-bolder">{{$post->title}}</h1>
                <p class="lead mb-0">A Bootstrap 5 starter layout for your next blog homepage</p>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="row">
            <!-- Blog entries-->
            <div class="col-lg-12">
                <p class="lead">{{$post->text}}</p>
            </div>
        </div>
    </div>
@endsection