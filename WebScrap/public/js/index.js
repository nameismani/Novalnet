let url_input =document.getElementById('url_input')

$('#submit_form').on('submit',(e)=>{
    e.preventDefault()
})

$('#submit').on('click',(e)=>{
  
      
    e.preventDefault()
    // const https = `https://`
    // console.log(isValidUrl(`${https}${url_input.val()}`))
    // if(url_input.val()){
      
        
            
        if(isValidUrl(url_input.value)){
          $("#submit").prop('disabled', true);
          $('#loader').show()
          if(!url_input.value.includes('https')){
            url_input.value = `https://${url_input.value}`
          }
          $("#err_show").text(``) 
          const data = {
            url_input:`${url_input.value.trim()}`
        }
        
        console.log('data',data)
      
       $('#modal_back').removeClass('index')
        fetch(`http://localhost:8000/checkvalidate`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data)
          
            if(data.status === 400){
              $('#loader').hide()
              $("#submit").prop('disabled', false);
                $("#err_show").text(`* ${data.message}`) 
            }
            if(data.status ===200){
            
                window.location.href='/companyDetails'
                setTimeout(()=>{
                  $("#submit").prop('disabled', false);
                  $('#loader').hide()
                },3000)
              
            }
        })
        }   
        else{
          $("#err_show").text(`* URL is Not Valid `) 
        }
           
            
}
    
   
)

function isValidUrl(str) {
    const pattern = new RegExp(
      '^([a-zA-Z]+:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(str);
  }



  $('#flipkart').click(()=>{
    $('#url_input').val('https://www.flipkart.com/sports/cycling/cycles/pr?sid=abc%2Culv%2Cixt&p%5B%5D=facets.tyre_size%255B%255D%3D27.5%2Binches&p%5B%5D=facets.tyre_size%255B%255D%3D28%2Binches&p%5B%5D=facets.tyre_size%255B%255D%3D29%2Binches&p%5B%5D=facets.brand%255B%255D%3DHERCULES&p%5B%5D=facets.brand%255B%255D%3DUrban%2BTerrain&p%5B%5D=facets.brand%255B%255D%3DHRX&p%5B%5D=facets.brand%255B%255D%3DLEADER&p%5B%5D=facets.brand%255B%255D%3DHERO&p%5B%5D=facets.brand%255B%255D%3DCRADIAC&p%5B%5D=facets.brand%255B%255D%3DAdrenex%2Bby%2BFlipkart&p%5B%5D=facets.brand%255B%255D%3DWALTX&p%5B%5D=facets.brand%255B%255D%3DVector%2B91&p%5B%5D=facets.brand%255B%255D%3DMontra&p%5B%5D=facets.brand%255B%255D%3DFIREFOX%2BBIKES&p%5B%5D=facets.fulfilled_by%255B%255D%3DPlus%2B%2528FAssured%2529&hpid=Lk-wso-VDfqk58fy3bl2IKp7_Hsxr70nj65vMAAFKlc%3D&ctx=eyJjYXJkQ29udGV4dCI6eyJhdHRyaWJ1dGVzIjp7InZhbHVlQ2FsbG91dCI6eyJtdWx0aVZhbHVlZEF0dHJpYnV0ZSI6eyJrZXkiOiJ2YWx1ZUNhbGxvdXQiLCJpbmZlcmVuY2VUeXBlIjoiVkFMVUVfQ0FMTE9VVCIsInZhbHVlcyI6WyJGcm9tIOKCuSAzOTk5Il0sInZhbHVlVHlwZSI6Ik1VTFRJX1ZBTFVFRCJ9fSwiaGVyb1BpZCI6eyJzaW5nbGVWYWx1ZUF0dHJpYnV0ZSI6eyJrZXkiOiJoZXJvUGlkIiwiaW5mZXJlbmNlVHlwZSI6IlBJRCIsInZhbHVlIjoiQ0NFR00zSzhLSDVZWkhBVSIsInZhbHVlVHlwZSI6IlNJTkdMRV9WQUxVRUQifX0sInRpdGxlIjp7Im11bHRpVmFsdWVkQXR0cmlidXRlIjp7ImtleSI6InRpdGxlIiwiaW5mZXJlbmNlVHlwZSI6IlRJVExFIiwidmFsdWVzIjpbIkdlYXJlZCBDeWNsZXMiXSwidmFsdWVUeXBlIjoiTVVMVElfVkFMVUVEIn19fX19')
  })
  $('#ikea').click(()=>{
    $('#url_input').val('https://www.ikea.com/in/en/campaigns/all-things-festive-all-things-home-pub38b0d800?itm_campaign=Launch&itm_element=SB1&itm_content=L2')
  })

  $('#meesho').click(()=>{
    $('#url_input').val('https://www.meesho.com/belts-men/pl/3nn')
  })

  $('#paytmmall').click(()=>{
    $('#url_input').val('https://paytmmall.com/men-clothing-glpid-5029')
  })
  $('#novalnet').click(()=>{
    $('#url_input').val('https://www.novalnet.com/')
  }) 

  $('#mi').click(()=>{
    $('#url_input').val('https://www.mi.com/in')
  }) 