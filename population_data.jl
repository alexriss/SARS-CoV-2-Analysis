# Helper script
# Parse population data from the UN and save it to a json file

using CSV
using JSON3

f = CSV.File(download("http://data.un.org/_Docs/SYB/CSV/SYB64_1_202110_Population,%20Surface%20Area%20and%20Density.csv"))

population = Dict{String,Float64}()
for l in f
    # there are entries for different years, but the most recent is always last
    if l[4] == "Population mid-year estimates (millions)"
        p = replace(l[5], "," => "")
        population[l[2]] = parse(Float64, p) 
    end
end

# some cleaning to be compatible with the JHU data
population["US"] = population["United States of America"]
population["World"] = population["Total, all countries or areas"]
population["Vietnam"] = population["Viet Nam"]
population["Venezuela"] = population["Venezuela (Boliv. Rep. of)"]
population["United Kingdom - Gibraltar"] = population["Gibraltar"]
population["Tanzania"] = population["United Rep. of Tanzania"]
population["Syria"] = population["Syrian Arab Republic"]
population["Russia"] = population["Russian Federation"]
population["Moldova"] = population["Republic of Moldova"]
population["laos"] = population["Lao People's Dem. Rep."]
population["Iran"] = population["Iran (Islamic Republic of)"]
population["Bolivia"] = population["Bolivia (Plurin. State of)"]
population["South Korea"] = population["Republic of Korea"]
population["China - Hong Kong"] = population["China, Hong Kong SAR"]


open("public/population.json", "w") do io
    JSON3.write(io, population)
end