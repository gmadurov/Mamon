from django import template

register = template.Library()


@register.filter(name="req_page")
def req_page(request, page):
    return request, page


@register.filter(name="page_num")
def page_num(req_page_output, page):
    request, pageName = req_page(req_page_output[0], req_page_output[1])
    get = request.GET.urlencode().replace(f"{pageName}={request.GET.get(pageName)}", "") + f"{pageName}={page}"
    return get
