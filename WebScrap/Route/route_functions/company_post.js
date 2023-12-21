const https = require('https')
const whois = require('whois-json')
const axios = require('axios')
const cheerio=require('cheerio')
const path = require('path')



const form_post = (req,res)=>{
    const http='https://'
 
    let {url_input} = req.session
    url_input=(url_input)
    let without_https = (new URL(url_input));
    without_https = without_https.hostname;
    if(without_https.includes('www')){
       without_https= without_https.split('.')
       without_https =`${without_https[1]}.${without_https[2]}`
    }

    
   

  
    try{
        https.get(`${url_input}`,(result,err)=>{
            
           const status_code =result.statusCode

            domain(without_https)
                                .then(({year,month,date,name,address}) => {
                                    const address_det = address
                                    const age_name ={
                                        age:`${year} Years ${month} Months ${date} Days`,
                                        name:name
                                    }
                                   
                                   
                                        
                                    add_product_details(url_input)

                                            .then(({product,address,price,contact})=>{
                                                
                                               if(address.length ===0){
                                                address=address_det
                                               }
                                                const datas ={
                                                    status_code:status_code,
                                                    domain_age:age_name,
                                                    list_of_product:product,
                                                    address:address,
                                                    url:url_input,
                                                    price:price,
                                                    contact:contact

                                                }
                                             
                                                  res.render(path.join(__dirname,'../../view/Dashboard.ejs'),{data:datas})
                                            })
                                            .catch((err)=>{
                                                res.render(path.join(__dirname,'../../view/ErrorPage.ejs'))
                                            })



                                 })
                                .catch((error) => {
                                    res.render(path.join(__dirname,'../../view/ErrorPage.ejs'))
                                });
            
                                
           })
           .on('error',(err)=>{
           
            res.render(path.join(__dirname,'../../view/ErrorPage.ejs'))
           })


                

 
      
    }catch(err){
        res.render(path.join(__dirname,'../../view/ErrorPage.ejs'))
    }
    
}
const domain = async (without_https)=>{
    const domain_age =await whois(without_https)    
    const registraction_add = [domain_age.registrantName,domain_age.registrantOrganization,domain_age.registrantStreet,domain_age.registrantCity,domain_age.registrantCountry]
    const creationDateMatch = domain_age.creationDate
    const creationDate = new Date(creationDateMatch);
    const currentDate = new Date();
    const year = currentDate.getFullYear() - creationDate.getFullYear()

    const month = Math.abs(currentDate.getMonth() - creationDate.getMonth())

    const date = currentDate.getDate() - creationDate.getDate()

    return ({year:year,month:month,date:date,name:domain_age.domainName,address:registraction_add})
    
}

const add_product_details =async (url)=>{
    
    
        const { data } = await axios.get(url)
        const $ = cheerio.load(data,{xmlMode: false})
        // removeFuntion($)
        let address_details=[]

    

      
     
        let support = []
        let product=[]
        let contact_det = []
   
        $('*').each((index,el)=>{
         
          if($(el)?.attr('class')?.toLocaleLowerCase().includes('address')){
                const add = $(el).text()
                address_details.push(add)
            }
     
            if(String($(el).attr('class')).toLocaleLowerCase().includes('product') || String($(el).attr('class')).toLocaleLowerCase().includes('rupess')     || String($(el).attr('class')).toLocaleLowerCase().includes('price')     || String($(el).attr('src')).toLocaleLowerCase().includes('product') ||  String($(el).find('a').attr('href')).toLocaleLowerCase().includes('product') || String($(el).attr('class')).toLocaleLowerCase().includes('goods') || String($(el).attr('src')).toLocaleLowerCase().includes('goods') ||  String($(el).find('a').attr('href')).toLocaleLowerCase().includes('goods')){
            
              
                let text =$(el).parent().text().trim()
             
                const src = $(el).parent().find('img').attr('src')
                
                if(text === '' || text.length > 300 ){
                    text =$(el).parent().find('img').attr('alt')
                }
               
             if(src && text ){
            
               if(text.includes('₹') || text.includes('$') || text.includes('Rs.')  || text.includes('%')  ){
                product.push({img:src,names:text})
                
               }
             }
         
            }
          
           else  if(String($(el).attr('id')).toLocaleLowerCase().includes('rating')){
                const sib = $(el).parent().siblings()
                const img = $(el).parent().parent().find('a').find('img').attr('src')
              
                let name = []
                $(sib).each((ind,el)=>{
                    const price = ($(el).text())
                    if((price !=='' && price) && price.length < 300){
                       
                     
                        name.push(price)
               
                        

                    }
                })
                if(img && name.length>0){
                    product.push({img:img,names:name})

                }

            }
       
           
              if(address_details.length===0 && ($(el)?.find('a')?.attr('href')?.toLocaleLowerCase().includes('support') ||  $(el)?.find('a')?.attr('href')?.toLocaleLowerCase().includes('about') ||  $(el)?.find('a')?.attr('href')?.toLocaleLowerCase().includes('contact') )){

                support.push($(el)?.find('a')?.attr('href'))
             }
           
               
             

         
        })
        product = product.filter((value,index)=>{
          return index === product.findIndex(o=> value.img === o.img)
        })
     
        support = support.filter((value,index)=>{
            return index === support.findIndex(o=> value === o)
          })
   
    let contact_us = []

if(support.length > 0){

    
    for(let contact of support){
      
        if(contact?.includes('https') && contact.toLocaleLowerCase().includes('support')){
            const {data} = await axios.get(contact)
            const $ = cheerio.load(data)
        $('*').each((index,ele)=>{
            if($(ele)?.text().toLocaleLowerCase().includes('contact')){
               if($(ele)?.find('a')?.attr('href')?.toLocaleLowerCase().includes('service')){
                const datas = $(ele)?.find('a')?.attr('href')
                contact_us.push(datas)
               }
            }
        })
    }    
    
    if(contact?.includes('https') && contact.toLocaleLowerCase().includes('about')){
       
        const {data} = await axios.get(contact)
        const $ = cheerio.load(data)
    $('*').each((index,ele)=>{

            if($(ele)?.attr('class')?.toLocaleLowerCase().includes('addr')){
                const address = $(ele)?.parent()?.text()
                address_details.push(address)
            }
            
            
       
        
    })  
    }
    
    }




} 
contact_us = contact_us.filter((value,index)=>{
    return index === contact_us.findIndex(o=> value === o)
  })



if(contact_us.length > 0){
   for(let contact_url of contact_us){
    
    if(contact_url.includes('https') ){
        const {data} = await axios.get(contact_url)
        const $ = cheerio.load(data)
        removeFuntion($)
        $('*').each((index,element)=>{
        if($(element)?.attr('class')?.toLocaleLowerCase().includes('phone')){
            const contact = ($(element)?.parent()?.text())       
            contact_det.push(contact)
        }
      
       
         
            
        })
    }
   }


}
contact_det = contact_det.filter((value,index)=>{
    return index === contact_det.findIndex(o=> value === o)
  })
        
return({product:product,address:address_details,contact:contact_det})

   
    
}

const removeFuntion = ($)=>{
    $('script')?.remove()
    $('style')?.remove()
    $('noscript')?.remove()
    $('textarea')?.remove()
}



module.exports={form_post}