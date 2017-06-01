
/*

See:
https://developer.yahoo.com/weather/


select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="El Calafate, Argentina")
 returns a JSON containing the id for the city, in this case 91815114
 

For example, calafate in english and C:
select item from weather.forecast where woeid=91815114 and u='c'
https://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20woeid%3D91815114%20and%20u%3D%27c%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

For example, calafate in english and F:
select item from weather.forecast where woeid=91815114 and u='f'
https://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20woeid%3D91815114%20and%20u%3D%27f%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

Something similar can be used to get the weather details in another language, see https://developer.yahoo.com/weather/ for more details
and https://developer.yahoo.com/weather/documentation.html




*/