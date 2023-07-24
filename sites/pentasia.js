"use strict";
const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");
let finalJobs = [];
const url = 'https://www.pentasia.com/_sf/api/v1/jobs/search.json';
const company = { company: "Pentasia" };
const apiKey = process.env.KNOX
const requestBody = {
  "job_search": {
    "query": "Romania",
    "location": {
      "address": "",
      "radius": 0,
      "region": "UK",
      "radius_units": "miles"
    },
    "filters": {},
    "commute_filter": {},
    "offset":0,
    "jobs_per_page": 100
  }
}
fetch(url, {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  }
})
  .then(response => response.json())
  .then(responseData => {
    let jobs = responseData.results;
    jobs.forEach(job => {
      const id = uuid.v4();
      const jobTitle = job.job.title;
      const externalPath = "https://www.pentasia.com/jobs/" + job.job.url_slug;
      finalJobs.push({
        id: id,
        job_title: jobTitle,
        job_link: externalPath,
        country: "Romania",
        city: "Bucharest",
        company: company.company,
      });
    });
    console.log(finalJobs.length)
  })
  .then(() => {
    console.log(JSON.stringify(finalJobs, null, 2));
    scraper.postApiPeViitor(finalJobs, company, apiKey);
    let logo =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZ8AAAB5CAMAAADRVtyNAAAA8FBMVEX///8AI0D/ggD/wH8AAC4AACoAHz0AIT8AACgAGTopOlAACjMAAzEABTEAAC3/egCytbv/4tP/5tnl5ujGyc3y8/QAFznf4OOan6cAACUAEDXT1dhgaXevsrgAHDyTmKEAACKmqrH/eAAAAB5LV2eHjZd7go3/vHZweIQAABp6gYzCxck3RVn/uIz/9/Lt7u8fMktXYXBFUWP/38IUK0U9Sl3/7uVpcX7/yJH/17H/iij/x6b/vpf/0KP/4sf/3cv/1Lz/nFUAABEAAAD/zJn/kT3/qXD/tmX/r3v/lUb/omP/hhv/upD/zbD/w6D/bgCaleR6AAASvUlEQVR4nO2de5+aRhfHYQMCgiyJgoKKeF139Vkv1TW3Jts0bdM2bd7/u3m4zAwDzACiK2mW3x/9NKtwDvOFmTNnziDDVKpUKY9evn59X7YPlSh6eHNz8+LFHx/K9qMSST+98Oi4unlTtiuV4nr1M4DjA/pctjuVcN2/weAEhB7K9qkS1IfPcToVoO9Hb14k4VSD0HejN2Q6PqAq0C5fn2l4XEAvynauUhofl1A1EypHD/+A/7mndm8BoJ9KdfN56v7r29H1dRCfZfCpZkIX18tfrq6vXF0/ev/6KYPPi2oMuqQe3l2NroBG75m08K3ic2ndP769vr4Kdf2b+8fXGYCqWdCF9OprBE4AyB2Efk4FVEVwF9HDP3+O4nQ8ffuYMQRVAdwl9ECE4z9Cv7ufpvGpcggX0EcaHhfQX/fMPX0Quinb9WehL3Q+V/5MiDoIvS7b9Wehryl8XL1zZ0UUQD+X7fqz0CgVjz8T+kAGVPG5hDL4XI0eKRPVm1dlu/4slMnnIeCTYFTxuYQe04cfl4+3znBz8/lDPJCrwutLKJPPN4b54/VPXkY73s2V7fqz0C8ZeK6/uAGc+z19xTCvIoCq6c8llIcPw7QH0u2cYR5wQFV29BL6M4vPI6P3Ld4S2MbGfYQ+I0JV9u0Sehhl8Bm9YgamwHoy2BU2CFXh2yV0n8Xn+oHZSGyg2u3QHYT+8OncVFsZLqH3WeHbW4aZ2CyUOmO8jOnNiw8VnYsoB5+mw4ZStu5BP1f1vZfS/zL4uOHbSsT4sNJtt2yfn5OyHp/rd0yLw/mwgtwv2+lnpFEWn0dmILNRQOJd2V4/Hz1mABoxzMBiY5Lrq7L9fjb6+Dadzz3TEOJ8WImtBqGL6W3aGPQnw9hJPu5MqF22289HX1P6uN8ZPdG9eRIrPpfTv9ToYPSFaakEPIJRjUAX1EOifNSnc/3lIxMPrwPZ27Jdfl66/ysBaPT3P16aoItldzA+S/zoVar0kq7pe9L94/v3/550ht8jgK6v/vLS0/pwwpPwsLKGHyuYYoqs3kZ75uGe2z+5ujqJ0OO3cNT57aOX/lzMxzKRDss2IjmEeo38LSBJUlRu2jzpCv/TegUCsNHHU87y8e/gJG+/eHD0wVo1qE3OR1o7g48nweLmz5YQ6puuTzvPW/ch/MVfdutvbDmt0c3IcTn4uDJuB6e5d6LKmxGgnml04qrM+6/BCRZjiTApxXQbOSwfH5ZVlmXECs3OcDjdrddOCbYDofnl9T/ZX86jZMot9ihEM6R5+bC20zqPg8fokyzLVq1Wky9vGgjxGb08zwnRijZFFoWPZCUkCPiTaNfP4+AxgvO38vigGpwTxx8k4pwHkxIJrxEf6TCIq8NaDXwkM5YUk0+n8vl8hPHbmbq35m1GP6VG5zOQT0Mjnm24xlIQysWDhPL5MP96ry24/nbaDBXThksPD8Rj+LjS1LDDHF86zP4O+DDMu9/+fHfGgrRpKqBabBTJ5MOsJmgR9uJD0HfB59zSPqXEZLV19MvZfNwhDU12L7008UPyYfQ1PcaOhde5+DAqfCKNw5M6ntCPyYfRe6SFBf/xEYfRr+bi0zXh8Y0n9TuhH5SPOwg5BDiCxK/vYkN8Lj7hpIpbPKXXCf2wfJiuGJ8H2bKxSa4V5OPT5sFJpMt2cD8uH6a9xwehmmHuB6QMWj4+jAFHIJ6ahiu2ap5+VAE++rGLimda7T9+LXODqg9sZU1bIcjJZwphiwQ3uv1Nr9cb13u9TWeR381FZ9Pbjie9zR31oGP4tBdDz421s3P/29ssMnvi9mLmHrB36t7XtaIdd3vhX/3EYXvHnqfveI1vW+ZkSP1OTj4L2FJcPEuq9RxOllyxNfc/Fiduh4RboTsNhBzRp2PvMJu1JcngzAne87Y+8UBo5OSRxqQK2ObwzlEDNwR3mPWkcOayQ79ZmoMdz1mS54Hnt9TgxDrp6w//AyLtK9Bbd2Ng1kZmxTSzUWk7yeCXg7QV6px8mrCp5Chqba0asemwLfOHBCHN9DOuXA9c2NSwIodJ5iacWnVVAQh9LiBZ04Rz7YMox73wPWkIlIxUd2taiUliTRaSA/TLkb++fT1KZhCah13i4gOztbyJMH13yHjeTuKzWHOkqbBgWJ3Y8ZoSYDiA4+TEdUkmuqgubXbgKcGnvXFIrRR4oiwJN2d7nwiewNclJz5IvwTrpwk+zV6KWWt8rqqNU/hsGrREhcDto9cZ4aOJxOPUOfjyUXx6XOqCis0nWkpTUo6QY9WBND4DkV5B4DVA0mwxFeez6uEPge0JX4yI5pFwPgvS3MyTAgAdwWfVi5SYC74bkYdDiCXsmamZmkC22UgPTuHTi1Z+EsyeCVBhPu3wBhIMxZx4qovhepGxxp8gjI+G2sf2hiT8XuYCQF1S2StUhE8br4NxY5Od78bW5OWw8lwYR5KGU+zkhhzEHKqFdVWCg7csmU+vgZmVeTPbbFHl5NOBOWwUv4UjjyQeFkFAoDcHdQ7eRlIdAxTyaYOnp6aoE28V8MBz4Y0n+2dv3SqB0AMqyAqUOcPc2iO6tiJOu01gsbka7kNyRg87oose3prMzzurpqf2dCoq6HoiBdBEPj0ZNztsNpHZrYpmnfY+PwW6cvKZw6t1QBOgnLbAbyLRmraEn1gb7K+Iz843KKh1ZLC7Rbsw7Xp02MqY/6B2Erhl3H/9gM7KY58h5NY60o/pWh01Op4FJvEZoEeQYHaqQAvqOTYr5uQzhjcdWOOeKbBlxMSBW+g+F3ZFkM9c85vcEiJhZUuE18RFz5bOpw3z6jWH1BQLCEgw0N+G0G9lnpikzFT4CImhdwQ+beRtPNkcvRjhHFmpfHyG8N6Sgr4C9RLCmHDcUIUOoo4C8LF7dc95Lt44XTgmxZYP0/nArG1tTe7qW3DQVNvxQ4wN4fv9dS3hBYFPD/Ul5AcEAVLPMALl4wMdB8OPvqtRnx5PsPMLa4UAH9YO8CSO6MLpanQFMJ0PeKgFleY77JUtOLXSwX0lsMQpfh+uo/AoS0LgA/sShdZ/dRopN8GRysVnGvbz/r9RL8FTjoIdDwqFIB/fVBJPmOCzIlPvVD7wnHIyowC0AjgkGCEMQcsl5s/wc3DKcBUzyQealSY0s8wuuPxzRAh5+ITzETm4LlgjFImMIkeAGxEFwxgf8l2lg8HCwMOzdD7bIO4TbLrnB/AAOaCj1QAfhZZVcZtDqMmyiWZvST4zcCc59CwbfG7N03PjOfh0UcGJIPqhGtq1r1Ltw36eAxcR8hFY8kGwbk/F/5jOR+QMd96StuYOzcKsOzQiUg+45dh1Z6ijtk/ymZicZdisTX98UDaZvwSfQZgmsPyeSYd5S4PUUUU9hNWQIR+ZkjuEdckW/sdUPnqrdZiz5qeUumP4VMKRegn48NRCsVZs2p/ko7e6g/nE+URfE2AYM/1aj1AWn9Yy7JmE4N5Gu1rllNsD9vygM0N8qEEnnAFHFjByrf+kRUmwocB4A/nkf48KNT96jNkThPgQeuRWa7DH9+CBpCzsXVMGSIa5A18CHRziQ33mYAbpeD5pijVU3Y7eNtmi80nTp7PzYS2OIAvP+ZnAGgyFqYOsJxiPgeZGfKhpw4vw0eDIKebNXhbjA67+nHwyJQJjqHvj055wmOMEkSrkI+xoB1yETx91s0bOUuX/Ch/BgbbQBiMz7bywucGKHJqfUvvEi/BBMwP3epKLvCT9R/gYNurM4JyCHaedFzY3SNihuSQ16jkPHx2oOwwkx/jMw/UIQ5ljcTRN+fhAs+3Aan9jX5SPZG7Dmw3OIexJt0UX6umDaRziQ/X4VD5utN07zB3wYgBVDsTGzK6wPAZryOL40Ou30vrpLD6BWTNm1s662tzK5CPULAcvm9DRAopNiiigULJejPCJL2aGOolPe2C58Y1h0Nacw4aax0rTJUPmFGvbGazIk4VUPs2BkdNsYSE+fpVRXAbH8fVOpKPWRYozFEX5kMrnwLUW5zNdilbqmjXWUPouWXwgCLYli/ymRwhIU/gMlmZus4UF+dS2PYLmraTLR/IJfHw6Pvrg1srY0hltqB3lbhdsQxkv46WSND5650izBZVzfS5UX0n3KeGjHxE8GZ+WIRPN0htKXyr0u97m7Gg2nMKnZR9rtqCO5jPM4xju45Py6TjRtrZtq4EpER8EBynJ8jukWMkcmc8wYVbCzTbOHx8U4KPweXT7lP1bJ9LZWqq5Xw60figtHl8DDdiUF+DYPDYJIPKJmVXM/X4TMds7e3x9PB9l0c4lPy56Gj4dtG+MFSxVnLYTkTItUakv5reKJVGCV+wtxyQ+Q8yspJpTLWH2/PPT3HzaKL1zzGbuJ+GDtZMkT4mRe1oieTHY1E3Few1HApCJTkbg0x2HZiXCliqmVD4ofjuq+uFJ+ITRrbKlnDcr0b9adKaGpHKxKYyA/CTwCcMLbk+ZzpXIB81/rFn2l5Gegk841XSoWaN8CzGt7mE+VvHJDLq4JJ8hqh01qWcdlMgH5g8IGz3oegI+Kx4VAtKXMo9YKOtObSysU0A6IckH1TIpdLNqfrMZOr5/g6UFZfNB93GaI0ctZOodE0054UkTfIbQJyPlPbtOiXxg/vqo6qEn4APKd1hBpiehs9OyUbW3qHoclCYl+MCFxzSzcDt1KXwWMIGQur4Q0xPwgXGklVKEsTiSD8PcCtGrS/CBxUznNUvV8XzQ+ukxAdz5+YQ7YlPcmBw9kUdXB0qw4nzaMHpLexPERCqRD9prn3YHuUQizVaQD9p1lPw+evd6yitNmvBRz99Q+g5WVwQNEueDzPL0c6yON0tVAT4zOAClva9PV0R1fteN1/ceyQfVQyW/jxpKoTuBlnrDhmr1D4e0yjVmD00G36LxEVL4aOXyaaEZasoj7u0jMQxOaQQuFuQDax2K8VmhjSBBQ/VnlqQ2DDmtLgzxyXh+0vjIUbMnqQAfFDnF3yWHCe1wUIMs0Pn5LLL7tzuUFAgaat8IUjmpxVX7aAlwAT53VtTsSSrCB212bFBHIDi3hwjPzwcV7Su0PGA/zDIHDQXrxtOqE3UWbr0I/h3no6ONnrTOo2XGzJ6kInxQCk6wKHci8hF2gQX5gMmGoBCKA9SMRtCxZbjgO3Dra+wnDiLSAHa4UTARX8OzUs2uazGzJ6kQHzSHFshdBdoOh16IWZAPfEgSb5VhwthBEIjn01nv82hj9mDtAWXnG9a6MDhN8IEVWlSzWH1DWXxQ25ABhdtJ0QtlC/JpgudQImw06qD8DmmDycrHY68FvKHaaKcMceeoqy0csmAdcoJPB1WSkzY/rXa+WaNkPt3wLc7mXbzJpyh+4dD4VJAPuhHM5CQUbXMRCEWPfb+dpEkskXxAQzdXJz35qHYE1f4n86PwmWSVJCAtwLMFU5DS+DBaOPYazgwboVeagBbAsQ32RfnAAEHgks2JtokJfC962tbefzuDYLXhQgwkGL7lwBZ7WvSo5tSBnwoGvB+SfMLflJUn0btG3wY7wK0uMJt/mwRVBfkwB6yMxzL3Hf9aF9rECEdlC5u/FuXThoGG4IQLpE0QdIyRKcPGXtKlbcHrj9Qp3IyIdrU0sRfiS1xt2wGMdG24N8PSRR49+IT1udvQLIstn2oTKRh6lBm83LStlzlVlE8EEGtbimiapqJgP+iJ4ynMh9mgOYylOsvZbO2YpgNuy0Wk/OB2PvNUdxSYAZihTKXAIjMGVnMg2LLvt2mKCv5zVny4YkFa3w6XiQQJMwt+N8aYoIuhxBDHqDAf5pBeqMhFlh8K8wlfBuHdBobfumhknkVe1GP4Qs0v73RULYFta2nKGT8gEsFDrA/RIi94ipm1dyu0wBDeFoVVnA+zuKUXUNq30aGxMB9mkHyZVRg5zZxkbUcgQZ15ppJ8mOaE+NI6pNoYX+8j11cptCsXZME3C/hIJ/9o0gl8mPZeJTePzcd/5bs4H2bDx0+PRbZdlVwCLRlBI8OVskhdfmdH/wmEmhp9GQm5PrFLeMEgbrYJYgj15N9MOoWP2+wG4V13hrpM5D5O4MNo45gNfOahzwhvqjT4LeCxAtFwLPzryyrpV8bcUWwdc51Wf002i+p5QIqSvt0pr+Dva34q+LKl4caR5Rp83UvNllWTtA1A+xSY+ZXO51fgSPLo9sSRjZoQWPB+TSsSturTpSjbwcfe5xbX6IU01sGOoHF8rtLqGaIs1WrwvT/ucbK5S77l+OW3ka9v8f0LwGwNmVUUzGwdmD05wIY7v4p3lHpnyK4t1RW/Xi+HXfKZss2kfUPvzHc73jVhr9frXeIGaA+3a9b7mGfX7CCyBYF+fXpzONmtJRV4znY6xB1A90CEj9reCTyzquKa1fKZLUfNrqenteFZoL9xQfc9OLo9Vt0TPfcPr35xvlKl703/B5jUyg9vcFv8AAAAAElFTkSuQmCC";
    let postLogo = new scraper.ApiScraper(
      "https://api.peviitor.ro/v1/logo/add/"
    );
    postLogo.headers.headers["Content-Type"] = "application/json";
    postLogo.post(JSON.stringify([{ id: company.company, logo: logo }]));

  })




